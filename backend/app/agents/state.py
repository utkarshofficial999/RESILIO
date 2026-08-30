from typing import TypedDict, List, Dict, Any, Optional

class ResilioState(TypedDict):
    transaction_id: str
    amount_in_cents: int
    cart_value_inr: float
    currency: str
    merchant_id: str
    customer_id: str
    bank_name: str
    gateway: str
    payment_method: str
    error_code: str
    error_description: str
    
    # Agent 1 Output
    failure_classification: Dict[str, Any]
    
    # Agent 2 Output
    telemetry_snapshot: Dict[str, Any]
    
    # Agent 3 Output
    candidate_strategies: List[str]
    
    # Agent 4 Output
    scored_strategies: List[Dict[str, Any]]
    selected_strategy: Dict[str, Any]
    counterfactual_explanation: Dict[str, Any]
    
    # Agent 5 Output
    execution_result: Dict[str, Any]
    
    # Agent 6 Output
    verified_status: str # SUCCESS, PARTIAL_SUCCESS, FAILED, REQUIRES_USER, ABANDONED
    
    # Agent 7 Output
    outcome_summary: Dict[str, Any]
    
    # Execution Tracking
    node_traces: List[Dict[str, Any]]
    user_intent_score: float
    budget_remaining: Dict[str, int]
    start_time_ms: float
    total_latency_ms: int
