from fastapi import APIRouter, HTTPException, status
from models.schemas import Product, ProductCreate
from services.firebase_service import db
from datetime import datetime

router = APIRouter()

@router.get("/")
async def get_products(category: str = None):
    products_ref = db.collection('products')
    if category:
        query = products_ref.where('category', '==', category).get()
    else:
        query = products_ref.get()
    
    products = []
    for doc in query:
        data = doc.to_dict()
        data['id'] = doc.id
        products.append(data)
        
    return {"status": "success", "results": len(products), "data": {"products": products}}

@router.get("/{product_id}")
async def get_product(product_id: str):
    doc = db.collection('products').document(product_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı")
    
    data = doc.to_dict()
    data['id'] = doc.id
    return {"status": "success", "data": {"product": data}}

@router.post("/")
async def create_product(product: ProductCreate):
    new_product = product.dict()
    new_product['createdAt'] = datetime.utcnow()
    new_product['updatedAt'] = datetime.utcnow()
    
    doc_ref = db.collection('products').add(new_product)
    return {"status": "success", "data": {"id": doc_ref[1].id}}
