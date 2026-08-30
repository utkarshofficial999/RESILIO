from typing import Dict, Any, List
import time

class TransactionMemory:
    """
    In-flight memory tracking transaction attempt history and budget bounds.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(TransactionMemory, cls).__new__(cls)
            cls._instance.history = {}
        return cls._instance

    def initialize_transaction(self, tx_id: str, amount_in_cents: int) -> Dict[str, Any]:
        cart_inr = amount_in_cents / 100.0
        
        # Determine Recovery Budget based on Cart Value
        if cart_inr >= 5000:
            budget = {"max_infra_retries": 3, "max_ui_flips": 2, "max_async_outreach": 1}
        elif cart_inr >= 1000:
            budget = {"max_infra_retries": 2, "max_ui_flips": 1, "max_async_outreach": 1}
        else:
            budget = {"max_infra_retries": 1, "max_ui_flips": 1, "max_async_outreach": 0}

        record = {
            "transaction_id": tx_id,
            "amount_in_cents": amount_in_cents,
            "cart_inr": cart_inr,
            "budget": budget,
            "attempts": [],
            "status": "INITIALIZED",
            "created_at": time.time()
        }
        self.history[tx_id] = record
        return record

    def record_attempt(self, tx_id: str, strategy: str, result_status: str, details: str):
        if tx_id not in self.history:
            self.initialize_transaction(tx_id, 499900)
            
        record = self.history[tx_id]
        attempt_number = len(record["attempts"]) + 1
        
        attempt = {
            "attempt_number": attempt_number,
            "strategy": strategy,
            "status": result_status,
            "details": details,
            "timestamp": time.time()
        }
        record["attempts"].append(attempt)
        
        # Deduct budget based on strategy type
        if "REROUTE" in strategy or "RETRY" in strategy:
            record["budget"]["max_infra_retries"] = max(0, record["budget"]["max_infra_retries"] - 1)
        elif "UI_FLIP" in strategy:
            record["budget"]["max_ui_flips"] = max(0, record["budget"]["max_ui_flips"] - 1)
        elif "ASYNC" in strategy:
            record["budget"]["max_async_outreach"] = max(0, record["budget"]["max_async_outreach"] - 1)

    def get_transaction(self, tx_id: str) -> Dict[str, Any]:
        return self.history.get(tx_id, {})

tx_memory = TransactionMemory()
