from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import time, uuid
from app.integrations.razorpay_client import RazorpayService
from app.agents.graph import resilio_graph
from app.memory.user_memory import user_memory
from app.memory.transaction_memory import tx_memory

router = APIRouter(prefix="/razorpay", tags=["Razorpay Live Gateway"])

class CreateOrderRequest(BaseModel):
    amount_in_cents: int = Field(default=249900, description="Amount in Paise (e.g. 249900 = ₹2,499)")
    currency: str = Field(default="INR")
    customer_id: str = Field(default="cust_live_001")
    merchant_id: str = Field(default="merch_enterprise_99")

class WebhookFailureEvent(BaseModel):
    event: str = Field(default="payment.failed")
    payment_id: str = Field(default="pay_live_failed_001")
    order_id: Optional[str] = None
    amount_in_cents: int = Field(default=249900)
    error_code: str = Field(default="GATEWAY_TIMEOUT")
    error_description: str = Field(default="Issuing bank server timeout during 3D Secure verification")
    bank: str = Field(default="HDFC")
    payment_method: str = Field(default="UPI")

@router.get("/status", summary="Check Live Razorpay API Connection")
def check_connection():
    """
    Verifies authentication credentials directly with Razorpay's API servers.
    """
    return RazorpayService.verify_connection()

@router.get("/key", summary="Get Razorpay Public Key ID")
def get_key_id():
    """Returns the public key_id for frontend Checkout widget. Never exposes the secret."""
    from app.config import settings
    return {"key_id": settings.RAZORPAY_KEY_ID}

@router.post("/verify-payment", summary="Verify Payment After Checkout")
def verify_payment(payment_id: str, order_id: str):
    """Fetches payment status from Razorpay after checkout completion."""
    try:
        payment = RazorpayService.fetch_payment(payment_id)
        return {
            "status": "PAYMENT_VERIFIED",
            "payment_id": payment.get("id"),
            "order_id": payment.get("order_id"),
            "amount": payment.get("amount"),
            "currency": payment.get("currency"),
            "method": payment.get("method"),
            "payment_status": payment.get("status"),
            "bank": payment.get("bank"),
            "error_code": payment.get("error_code"),
            "error_description": payment.get("error_description"),
        }
    except Exception as e:
        return {"status": "VERIFICATION_FAILED", "error": str(e)}

@router.post("/create-order", summary="Create Real Razorpay Test Order")
def create_test_order(payload: CreateOrderRequest):
    """
    Generates a live Order record directly on Razorpay's server.
    """
    try:
        order = RazorpayService.create_order(
            amount_in_cents=payload.amount_in_cents,
            currency=payload.currency,
            notes={
                "customer_id": payload.customer_id,
                "merchant_id": payload.merchant_id,
                "platform": "RESILIO Autonomous Recovery Engine"
            }
        )
        return {
            "status": "ORDER_CREATED_ON_RAZORPAY",
            "order_id": order.get("id"),
            "id": order.get("id"),
            "amount": order.get("amount"),
            "currency": order.get("currency"),
            "receipt": order.get("receipt"),
            "raw_order": order
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create order on Razorpay: {str(e)}")

@router.post("/webhook-recover", summary="Ingest Razorpay Failure Webhook into RESILIO Engine")
def ingest_webhook_and_recover(event_data: WebhookFailureEvent):
    """
    Accepts a real Razorpay payment.failed payload and triggers the 7-node LangGraph recovery agent workflow.
    """
    tx_id = event_data.payment_id or f"pay_{uuid.uuid4().hex[:8]}"
    start_time = time.time()
    
    intent_score = user_memory.compute_user_intent_score(event_data.amount_in_cents)
    mem_record = tx_memory.initialize_transaction(tx_id, event_data.amount_in_cents)
    
    initial_state = {
        "transaction_id": tx_id,
        "amount_in_cents": event_data.amount_in_cents,
        "cart_value_inr": event_data.amount_in_cents / 100.0,
        "currency": "INR",
        "merchant_id": "merch_enterprise_99",
        "customer_id": "cust_webhook_user",
        "bank_name": event_data.bank,
        "gateway": "Razorpay Core Engine",
        "payment_method": event_data.payment_method,
        "error_code": event_data.error_code,
        "error_description": event_data.error_description,
        "failure_classification": {},
        "telemetry_snapshot": {},
        "candidate_strategies": [],
        "scored_strategies": [],
        "selected_strategy": {},
        "counterfactual_explanation": {},
        "execution_result": {},
        "verified_status": "PENDING",
        "outcome_summary": {},
        "node_traces": [],
        "user_intent_score": intent_score,
        "budget_remaining": mem_record["budget"],
        "start_time_ms": start_time,
        "total_latency_ms": 0
    }
    
    final_state = resilio_graph.invoke(initial_state)
    total_latency_ms = int((time.time() - start_time) * 1000)
    
    return {
        "transaction_id": tx_id,
        "status": final_state.get("verified_status"),
        "selected_strategy": final_state.get("selected_strategy", {}).get("strategy"),
        "expected_recovery_value": final_state.get("selected_strategy", {}).get("expected_value"),
        "total_latency_ms": total_latency_ms,
        "counterfactual_explanation": final_state.get("counterfactual_explanation"),
        "execution_result": final_state.get("execution_result"),
        "node_traces": final_state.get("node_traces"),
        "razorpay_source": "Live Test Mode Gateway API"
    }
