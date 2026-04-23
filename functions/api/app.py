from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth, products, orders, payment

app = FastAPI(title="Yapı Malzemesi API", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/api/health")
async def health_check():
    return {
        "success": True,
        "message": "API çalışıyor (Python)",
        "environment": "production"
    }

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(products.router, prefix="/api/products", tags=["Products"])
app.include_router(orders.router, prefix="/api/orders", tags=["Orders"])
app.include_router(payment.router, prefix="/api/payment", tags=["Payment"])
