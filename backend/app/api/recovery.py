from fastapi import APIRouter
from typing import Dict, Any
import time, uuid
from app.schemas.schemas import FailureSimulateRequest
from app.agents.graph import resilio_graph
from app.memory.user_memory import user_memory
from app.memory.transaction_memory import tx_memory

router = APIRouter(prefix="/recovery", tags=["Recovery Agent"])

@router.post("/process", summary="Process failed transaction through Resilio LangGraph Agent")
def process_failed_transaction(payload: FailureSimulateRequest) -> Dict[str, Any]:
    tx_id = payload.transaction_id or f"tx_{uuid.uuid4().hex[:8]}"
    start_time = time.time()
    
    # Calculate User Intent Score
    intent_score = user_memory.compute_user_intent_score(payload.amount_in_cents)
    
    # Initialize Memory & Recovery Budget
    mem_record = tx_memory.initialize_transaction(tx_id, payload.amount_in_cents)
    
    initial_state = {
        "transaction_id": tx_id,
        "amount_in_cents": payload.amount_in_cents,
        "cart_value_inr": payload.amount_in_cents / 100.0,
        "currency": "INR",
        "merchant_id": "merch_razorpay_001",
        "customer_id": "cust_user_99",
        "bank_name": payload.bank_name,
        "gateway": payload.gateway,
        "payment_method": payload.payment_method,
        "error_code": payload.error_code,
        "error_description": payload.error_description,
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

    # Execute 7-Node LangGraph Workflow
    final_state = resilio_graph.invoke(initial_state)
    
    total_latency_ms = int((time.time() - start_time) * 1000)
    final_state["total_latency_ms"] = total_latency_ms
    
    return {
        "transaction_id": tx_id,
        "status": final_state.get("verified_status"),
        "selected_strategy": final_state.get("selected_strategy", {}).get("strategy"),
        "expected_recovery_value": final_state.get("selected_strategy", {}).get("expected_value"),
        "total_latency_ms": total_latency_ms,
        "counterfactual_explanation": final_state.get("counterfactual_explanation"),
        "execution_result": final_state.get("execution_result"),
        "node_traces": final_state.get("node_traces")
    }
