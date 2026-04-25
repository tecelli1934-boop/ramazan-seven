from fastapi import APIRouter, HTTPException
from services.payment_service import payment_service

router = APIRouter()

@router.post("/process")
async def process_payment(payment_data: dict):
    order_data = payment_data.get('orderData')
    card_data = payment_data.get('cardData')
    
    if not order_data or not card_data:
        raise HTTPException(status_code=400, detail="Eksik bilgi gönderildi")

    try:
        result = await payment_service.process_payment(order_data, card_data)
        if result.get('success'):
            return {
                "success": True,
                "transactionId": result.get('transactionId'),
                "message": "Ödeme onaylandı"
            }
        else:
            raise HTTPException(status_code=400, detail=result.get('message', "Ödeme reddedildi"))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
