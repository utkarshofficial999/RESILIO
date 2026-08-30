from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class TransactionCreate(BaseModel):
    amount_in_cents: int = Field(..., description="Amount in subunit (e.g. paisa/cents)")
    currency: str = "INR"
    merchant_id: str = "merch_razorpay_001"
    customer_id: str = "cust_user_99"
    payment_method: str = "CARD"  # CARD, UPI, NETBANKING, WALLET
    bank_name: str = "HDFC"       # HDFC, ICICI, SBI, AXIS
    gateway: str = "Gateway_A"   # Gateway_A, Gateway_B, Gateway_C

class FailureSimulateRequest(BaseModel):
    transaction_id: Optional[str] = None
    error_code: str = "BANK_TIMEOUT" # BANK_TIMEOUT, INSUFFICIENT_FUNDS, GATEWAY_TIMEOUT, CARD_DECLINED, BANK_DOWN
    error_description: str = "HDFC Bank Netbanking gateway response timed out after 5000ms"
    amount_in_cents: int = 499900
    payment_method: str = "CARD"
    bank_name: str = "HDFC"
    gateway: str = "Gateway_A"

class FailureClassification(BaseModel):
    category: str # "INFRASTRUCTURE", "USER_INTENT", "UNKNOWN"
    error_code: str
    severity: str # "HIGH", "MEDIUM", "LOW"
    recoverability: str # "HIGH", "MODERATE", "LOW", "UNRECOVERABLE"
    confidence: float
    recommended_strategies: List[str]
    diagnosis_reason: str

class TelemetrySnapshot(BaseModel):
    bank_name: str
    bank_success_rate: float
    gateway_name: str
    gateway_success_rate: float
    network_latency_ms: int
    is_outage: bool
    alternative_rail_available: bool
    recommended_rail: Optional[str] = None

class StrategyScore(BaseModel):
    strategy: str # RETRY, REROUTE, UI_FLIP, WAIT_AND_RETRY, ASYNC_RECOVERY, ABANDON
    success_probability: float
    friction_score: float # 0.0 (no friction) to 1.0 (high friction)
    expected_value: float # In INR
    latency_ms: int
    risk_level: str # LOW, MEDIUM, HIGH
    target_rail_or_action: Optional[str] = None
    rank: int = 0

class CounterfactualAlternative(BaseModel):
    strategy: str
    expected_recovery_prob: float
    expected_value: float
    friction: str
    reasoning: str

class CounterfactualExplanation(BaseModel):
    transaction_id: str
    selected_strategy: str
    selected_expected_value: float
    why_this_action: str
    alternatives: List[CounterfactualAlternative]

class RecoveryResult(BaseModel):
    transaction_id: str
    status: str # SUCCESS, PARTIAL_SUCCESS, FAILED, REQUIRES_USER, ABANDONED
    executed_strategy: str
    new_rail: Optional[str] = None
    execution_time_ms: int
    attempts_used: int
    recovery_budget_remaining: Dict[str, int]
    message: str

class BankHealthSchema(BaseModel):
    bank_name: str
    success_rate: float
    status: str # HEALTHY, DEGRADED, OUTAGE
    latency_ms: int
    error_rate: float

class ABSimulationRequest(BaseModel):
    total_transactions: int = 1000
    outage_bank: Optional[str] = None

class ABSimulationReport(BaseModel):
    total_transactions: int
    control_recovered: int
    control_abandoned: int
    control_recovery_rate: float
    control_gmv_rescued: float
    
    resilio_recovered: int
    resilio_abandoned: int
    resilio_recovery_rate: float
    resilio_gmv_rescued: float
    
    recovery_lift_percentage_points: float
    gmv_lift_amount: float
    customer_friction_avoided_count: int
    unnecessary_retries_avoided_count: int
    best_strategy_distribution: Dict[str, int]

class AgentNodeTrace(BaseModel):
    node_name: str
    agent_id: str
    status: str
    input_payload: Dict[str, Any]
    output_payload: Dict[str, Any]
    timestamp: str
