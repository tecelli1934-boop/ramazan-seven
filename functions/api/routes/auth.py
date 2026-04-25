from fastapi import APIRouter, HTTPException, Depends, status
from models.schemas import UserCreate, User
from services.firebase_service import db, auth as firebase_auth
from services.email_service import email_service
from passlib.context import CryptContext
import jwt
import os
from datetime import datetime, timedelta
from typing import Optional

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
JWT_SECRET = os.environ.get('JWT_SECRET', 'super-secret-key')
ALGORITHM = "HS256"

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/signup")
async def signup(user_data: UserCreate):
    # Check if user exists in Firestore
    users_ref = db.collection('users')
    existing_user = users_ref.where('email', '==', user_data.email).get()
    if existing_user:
        raise HTTPException(status_code=400, detail="Bu email adresi zaten kayıtlı")

    try:
        # 1. Create user in Firebase Auth
        auth_user = firebase_auth.create_user(
            email=user_data.email,
            password=user_data.password,
            display_name=user_data.name,
            disabled=True # Disable until email verified
        )
        user_id = auth_user.uid

        # 2. Hash password for Firestore (optional if only using Auth for login, but let's keep it for compatibility)
        hashed_password = pwd_context.hash(user_data.password)
        
        # 3. Create user in Firestore
        new_user = {
            "name": user_data.name,
            "email": user_data.email,
            "password": hashed_password,
            "phone": user_data.phone,
            "role": "user",
            "active": True,
            "emailVerified": False,
            "uid": user_id,
            "createdAt": datetime.utcnow()
        }
        
        db.collection('users').document(user_id).set(new_user)

        # 4. Generate verification token
        token = email_service.generate_token()
        db.collection('verification_tokens').add({
            "userId": user_id,
            "token": token,
            "expires": datetime.utcnow() + timedelta(hours=24)
        })

        # 5. Send custom email (Our fixed one!)
        email_service.send_verification_email(user_data.name, user_data.email, token)

        return {
            "status": "success",
            "message": "Kayıt başarılı! Lütfen email adresinizi doğrulayın.",
            "data": {"user": {"id": user_id, "name": user_data.name, "email": user_data.email}}
        }
    except Exception as e:
        print(f"Signup error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    return {
        "status": "success",
        "message": "Kayıt başarılı! Lütfen email adresinizi doğrulayın.",
        "data": {"user": {"id": user_id, "name": user_data.name, "email": user_data.email}}
    }

@router.post("/login")
async def login(login_data: dict):
    email = login_data.get('email')
    password = login_data.get('password')
    
    if not email or not password:
        raise HTTPException(status_code=400, detail="Lütfen email ve şifrenizi girin")

    user_query = db.collection('users').where('email', '==', email).limit(1).get()
    if not user_query:
        raise HTTPException(status_code=401, detail="Email veya şifre hatalı")
    
    user_doc = user_query[0]
    user_data = user_doc.to_dict()
    
    if not pwd_context.verify(password, user_data.get('password')):
        raise HTTPException(status_code=401, detail="Email veya şifre hatalı")
    
    if not user_data.get('active', True):
        raise HTTPException(status_code=401, detail="Hesabınız deaktive edilmiş")

    # Update last login
    user_doc.reference.update({"lastLogin": datetime.utcnow()})

    token = create_access_token(data={"id": user_doc.id})
    
    # Clean user data for response
    del user_data['password']
    
    return {
        "status": "success",
        "token": token,
        "data": {"user": {**user_data, "id": user_doc.id}}
    }

@router.get("/email-dogrula/{token}")
async def verify_email(token: str):
    token_query = db.collection('verification_tokens').where('token', '==', token).limit(1).get()
    if not token_query:
        raise HTTPException(status_code=400, detail="Geçersiz veya süresi dolmuş doğrulama linki")
    
    token_doc = token_query[0]
    token_data = token_doc.to_dict()
    
    if token_data.get('expires').replace(tzinfo=None) < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Doğrulama linkinin süresi dolmuş")
    
    user_id = token_data.get('userId')
    db.collection('users').document(user_id).update({"emailVerified": True})
    
    # Enable user in Firebase Auth
    try:
        firebase_auth.update_user(user_id, disabled=False)
    except Exception as e:
        print(f"Error enabling user in Auth: {e}")

    token_doc.reference.delete()

    return {"status": "success", "message": "Email adresiniz başarıyla doğrulandı!"}

@router.post("/sifremi-unuttum")
async def forgot_password(data: dict):
    email = data.get('email')
    if not email:
        raise HTTPException(status_code=400, detail="Email adresi gereklidir")

    user_query = db.collection('users').where('email', '==', email).limit(1).get()
    if not user_query:
        raise HTTPException(status_code=404, detail="Bu email adresi bulunamadı")
    
    user_doc = user_query[0]
    user_data = user_doc.to_dict()
    
    token = email_service.generate_token()
    db.collection('reset_tokens').add({
        "userId": user_doc.id,
        "token": token,
        "expires": datetime.utcnow() + timedelta(hours=1)
    })

    email_service.send_password_reset_email(user_data.get('name'), email, token)

    return {"status": "success", "message": "Şifre sıfırlama linki gönderildi"}

@router.patch("/sifre-sifirlama/{token}")
async def reset_password(token: str, data: dict):
    password = data.get('password')
    if not password:
        raise HTTPException(status_code=400, detail="Yeni şifre gereklidir")

    token_query = db.collection('reset_tokens').where('token', '==', token).limit(1).get()
    if not token_query:
        raise HTTPException(status_code=400, detail="Geçersiz veya süresi dolmuş token")
    
    token_doc = token_query[0]
    token_data = token_doc.to_dict()
    
    if token_data.get('expires').replace(tzinfo=None) < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token süresi dolmuş")
    
    user_id = token_data.get('userId')
    hashed_password = pwd_context.hash(password)
    db.collection('users').document(user_id).update({"password": hashed_password})
    token_doc.reference.delete()

    return {"status": "success", "message": "Şifreniz başarıyla güncellendi"}
