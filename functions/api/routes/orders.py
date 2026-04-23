from fastapi import APIRouter, HTTPException, Request
from ...models.schemas import OrderCreate
from ...services.firebase_service import db, fcm
from ...services.email_service import email_service
from datetime import datetime
import json

router = APIRouter()

@router.post("/")
async def create_order(order_data: OrderCreate, request: Request):
    # Log incoming request
    print(f"Yeni Sipariş İsteği: {order_data.customerEmail}")

    # 1. Process items and check stock
    items_price = 0
    processed_items = []
    
    for item in order_data.orderItems:
        product_ref = db.collection('products').document(item.id)
        product_doc = product_ref.get()
        
        if not product_doc.exists:
            raise HTTPException(status_code=400, detail=f"{item.name} bulunamadı")
        
        product_data = product_doc.to_dict()
        if product_data.get('stock', 0) < item.quantity:
            raise HTTPException(status_code=400, detail=f"{item.name} için yeterli stok yok")
        
        # Update stock
        product_ref.update({"stock": product_data['stock'] - item.quantity})
        
        item_total = item.price * item.quantity
        items_price += item_total
        processed_items.append(item.dict())

    # 2. Calculate prices
    shipping_price = 0 if items_price > 500 else 29.99
    kdv = round(items_price * 0.18, 2)
    total = items_price + shipping_price + kdv

    # 3. Generate Order ID (Simple counter in Firestore or random)
    # For now, let's use a timestamp based ID or a counter doc
    # To keep it simple, we'll use a random integer for now or search last
    # In a real app, use a transaction for counters
    order_id = int(datetime.utcnow().timestamp())

    # 4. Create Order
    new_order = {
        "id": order_id,
        "customerName": order_data.customerName or "Misafir",
        "customerEmail": order_data.customerEmail,
        "customerPhone": order_data.customerPhone,
        "address": f"{order_data.shippingAddress.get('street')}, {order_data.shippingAddress.get('district')}",
        "items": processed_items,
        "subtotal": items_price,
        "kdv": kdv,
        "total": total,
        "paymentMethod": order_data.paymentMethod,
        "status": "pending",
        "date": datetime.utcnow()
    }

    db.collection('orders').add(new_order)

    # 5. Send Notifications
    try:
        # Email notification
        # email_service.send_order_confirmation(new_order)
        
        # Push notification (FCM)
        user_query = db.collection('users').where('email', '==', order_data.customerEmail).limit(1).get()
        if user_query:
            user_data = user_query[0].to_dict()
            fcm_tokens = user_data.get('fcmTokens', [])
            if fcm_tokens:
                # Use firebase_admin.messaging to send push
                pass
    except Exception as e:
        print(f"Bildirim hatası: {e}")

    return {"status": "success", "message": "Sipariş başarıyla oluşturuldu", "data": {"order": new_order}}
