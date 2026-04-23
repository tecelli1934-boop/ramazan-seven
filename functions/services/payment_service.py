import hashlib
import base64
import os
import time
from dotenv import load_dotenv

load_dotenv()

class KuveytPayService:
    def __init__(self):
        self.api_url = os.environ.get('KUVEYT_API_URL', 'https://boa.kuveytturk.com.tr/sanalpos/pay/')
        self.merchant_id = os.environ.get('KUVEYT_MERCHANT_ID')
        self.api_user = os.environ.get('KUVEYT_API_USER')
        self.api_pass = os.environ.get('KUVEYT_API_PASS')
        self.terminal_id = os.environ.get('KUVEYT_TERMINAL_ID')

    def generate_hash(self, order_id, amount, ok_url, fail_url):
        # SHA256(ApiPass)
        hashed_pass = base64.b64encode(hashlib.sha256(self.api_pass.encode()).digest()).decode()
        # rawData: MerchantId + OrderId + Amount + OkUrl + FailUrl + ApiUser + SHA256(ApiPass)
        raw_data = f"{self.merchant_id}{order_id}{amount}{ok_url}{fail_url}{self.api_user}{hashed_pass}"
        return base64.b64encode(hashlib.sha256(raw_data.encode()).digest()).decode()

    async def process_payment(self, order_data, card_data):
        try:
            amount = order_data.get('amount')
            order_id = order_data.get('orderId')
            ok_url = order_data.get('okUrl')
            fail_url = order_data.get('failUrl')
            amount_in_cents = round(amount * 100)

            # In development, return simulation
            print("Kuveyt Türk XML İsteği Hazırlandı (Simülasyon)")
            return {
                "success": True,
                "transactionId": f"SIMULATED_{int(time.time() * 1000)}",
                "message": "Başarılı (Simüle Edildi)"
            }
            
            # Real implementation would involve sending XML POST request
            # ...
        except Exception as e:
            print(f"Kuveyt Türk Servis Hatası: {e}")
            raise Exception("Banka bağlantısı kurulamadı.")

payment_service = KuveytPayService()
