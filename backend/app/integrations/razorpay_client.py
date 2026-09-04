import razorpay
from typing import Dict, Any, Optional
from app.config import settings

class RazorpayService:
    """
    Direct client wrapper for Razorpay Test & Production APIs.
    Handles order generation, payment status lookups, and webhook payload parsing.
    """
    _client: Optional[razorpay.Client] = None

    @classmethod
    def get_client(cls) -> Optional[razorpay.Client]:
        if cls._client is None and settings.RAZORPAY_KEY_ID and settings.RAZORPAY_KEY_SECRET:
            try:
                cls._client = razorpay.Client(
                    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
                )
            except Exception as e:
                print(f"[RAZORPAY CLIENT ERROR] Could not initialize client: {e}")
                return None
        return cls._client

    @classmethod
    def verify_connection(cls) -> Dict[str, Any]:
        """Validates API keys against live Razorpay servers by attempting an lightweight query."""
        client = cls.get_client()
        if not client:
            return {
                "connected": False,
                "mode": "DISCONNECTED",
                "key_id_masked": "NOT_SET",
                "error": "Razorpay API keys not configured."
            }
        try:
            # Query recent payments or orders as a health check
            orders = client.order.all({"count": 1})
            masked_key = f"{settings.RAZORPAY_KEY_ID[:8]}...{settings.RAZORPAY_KEY_ID[-4:]}" if len(settings.RAZORPAY_KEY_ID) > 12 else "rzp_test_***"
            return {
                "connected": True,
                "mode": "TEST_MODE" if "test" in settings.RAZORPAY_KEY_ID else "LIVE_MODE",
                "key_id_masked": masked_key,
                "gateway": "Razorpay Payments API v1",
                "status": "ACTIVE_AUTHENTICATED"
            }
        except Exception as e:
            return {
                "connected": False,
                "mode": "ERROR",
                "key_id_masked": "INVALID_KEY",
                "error": str(e)
            }

    @classmethod
    def create_order(cls, amount_in_cents: int, currency: str = "INR", notes: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Creates a real order on Razorpay servers."""
        client = cls.get_client()
        if not client:
            raise ValueError("Razorpay client is not configured")
        
        payload = {
            "amount": amount_in_cents, # in paise
            "currency": currency,
            "receipt": f"resilio_rec_{amount_in_cents}",
            "notes": notes or {"origin": "RESILIO_AUTONOMOUS_RECOVERY"}
        }
        return client.order.create(payload)

    @classmethod
    def fetch_payment(cls, payment_id: str) -> Dict[str, Any]:
        """Fetches payment entity from Razorpay to check failure reason/status."""
        client = cls.get_client()
        if not client:
            raise ValueError("Razorpay client is not configured")
        return client.payment.fetch(payment_id)
