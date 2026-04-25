from firebase_functions import https_fn
from firebase_admin import initialize_app
import os

# Initialize Firebase Admin
try:
    initialize_app()
except Exception:
    # If already initialized
    pass

@https_fn.on_request()
def api(req: https_fn.Request) -> https_fn.Response:
    # Use mangum to wrap FastAPI for Firebase Functions
    from api.app import app
    from mangum import Mangum
    handler = Mangum(app, lifespan="off")
    return handler(req, {})
