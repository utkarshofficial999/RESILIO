from typing import Dict, Any

class UserPreferenceMemory:
    """
    Tracks synthetic user profiles and calculates User Intent Score (0.0 to 1.0).
    NEVER stores sensitive payment details (cards, CVV, passwords).
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(UserPreferenceMemory, cls).__new__(cls)
        return cls._instance

    def get_user_profile(self, customer_id: str) -> Dict[str, Any]:
        # Return synthetic profile based on customer_id
        return {
            "customer_id": customer_id,
            "preferred_payment_method": "UPI",
            "historical_success_method": "UPI",
            "average_cart_value_in_inr": 3200,
            "previous_recovery_success": "HIGH",
            "total_purchases": 12
        }

    def compute_user_intent_score(
        self,
        amount_in_cents: int,
        checkout_duration_sec: int = 45,
        interactions_count: int = 3,
        previous_purchases: int = 5
    ) -> float:
        """
        Calculates User Intent Score (0.0 to 1.0) based on non-sensitive signals:
        - Higher cart value indicates higher purchase intent
        - Higher interaction count indicates active attempt to complete purchase
        - Previous purchase history adds trust score
        """
        cart_value_inr = amount_in_cents / 100.0
        
        # Base intent score
        score = 0.50
        
        # Cart value weight
        if cart_value_inr > 5000:
            score += 0.20
        elif cart_value_inr > 1000:
            score += 0.10
            
        # Interaction count weight (shows customer effort)
        if interactions_count >= 3:
            score += 0.15
        elif interactions_count >= 1:
            score += 0.05
            
        # Purchase history weight
        if previous_purchases > 3:
            score += 0.15
            
        return round(min(score, 0.98), 2)

user_memory = UserPreferenceMemory()
