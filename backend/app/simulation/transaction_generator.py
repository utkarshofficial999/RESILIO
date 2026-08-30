import random

def generate_synthetic_transactions(count: int = 1000) -> list:
    """
    Generates a deterministic batch of synthetic failed transactions for A/B testing.
    """
    random.seed(42)
    banks = ["HDFC", "ICICI", "SBI", "AXIS"]
    gateways = ["Gateway_A", "Gateway_B", "Gateway_C"]
    methods = ["CARD", "UPI", "NETBANKING", "WALLET"]
    error_types = [
        ("BANK_TIMEOUT", "HDFC gateway response timed out", "INFRASTRUCTURE"),
        ("GATEWAY_TIMEOUT", "Gateway A connection reset", "INFRASTRUCTURE"),
        ("INSUFFICIENT_FUNDS", "Account balance insufficient for transaction", "USER_INTENT"),
        ("CARD_DECLINED", "Card issuer declined transaction", "USER_INTENT"),
        ("BANK_DOWN", "SBI core banking services down", "INFRASTRUCTURE")
    ]
    
    transactions = []
    for i in range(count):
        bank = random.choice(banks)
        err = random.choice(error_types)
        amount = random.randint(50000, 1500000) # ₹500 to ₹15,000
        
        transactions.append({
            "transaction_id": f"tx_sim_{i+1000:04d}",
            "amount_in_cents": amount,
            "cart_value_inr": amount / 100.0,
            "currency": "INR",
            "bank_name": bank,
            "gateway": random.choice(gateways),
            "payment_method": random.choice(methods),
            "error_code": err[0],
            "error_description": err[1],
            "category": err[2]
        })
        
    return transactions
