import firebase_admin
from firebase_admin import credentials, firestore, auth, messaging
import os
from dotenv import load_dotenv

load_dotenv()

def initialize_firebase():
    if not firebase_admin._apps:
        # Check if running in Firebase environment
        if os.environ.get('FIREBASE_CONFIG'):
            firebase_admin.initialize_app()
        else:
            # Local development with service account
            try:
                private_key = os.environ.get('FIREBASE_PRIVATE_KEY', '').replace('\\n', '\n')
                cred = credentials.Certificate({
                    "project_id": os.environ.get('FIREBASE_PROJECT_ID'),
                    "client_email": os.environ.get('FIREBASE_CLIENT_EMAIL'),
                    "private_key": private_key
                })
                firebase_admin.initialize_app(cred)
            except Exception as e:
                print(f"Firebase initialization warning: {e}")
                firebase_admin.initialize_app()

initialize_firebase()

db = firestore.client()
fcm = messaging

__all__ = ['db', 'auth', 'fcm']
