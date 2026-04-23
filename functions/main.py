from firebase_functions import https_fn
from firebase_admin import initialize_app
from api.app import app
import os

# Initialize Firebase Admin
if not os.environ.get('FIREBASE_CONFIG'):
    # If running locally, you might need to provide a service account
    pass
else:
    initialize_app()

@https_fn.on_request()
def api(req: https_fn.Request) -> https_fn.Response:
    # Use mangum to wrap FastAPI for Firebase Functions
    from mangum import Mangum
    handler = Mangum(app, lifespan="off")
    return handler(req)
