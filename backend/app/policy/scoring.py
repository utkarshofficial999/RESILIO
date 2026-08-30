from typing import Dict, Any, List
from app.schemas.schemas import StrategyScore

def calculate_expected_recovery_value(
    cart_value_inr: float,
    strategy: str,
    success_prob: float,
    friction_score: float, # 0.0 to 1.0
    latency_ms: int,
    risk_level: str = "LOW"
) -> float:
    """
    Calculates Expected Recovery Value (ERV) using the formula:
    ERV = (Cart Value * Success Probability) - Recovery Cost - Friction Penalty - Risk Penalty
    """
    base_recovery_value = cart_value_inr * success_prob
    
    # Cost per strategy type (in INR)
    recovery_costs = {
        "RETRY": 5.0,           # Low gateway ping cost
        "REROUTE": 12.0,        # Routing switch overhead
        "UI_FLIP": 25.0,        # In-flight widget state sync
        "WAIT_AND_RETRY": 8.0,  # Telemetry polling cost
        "ASYNC_RECOVERY": 45.0, # WhatsApp/SMS SMS API fee
        "ABANDON": 0.0
    }
    cost = recovery_costs.get(strategy, 10.0)
    
    # Friction Penalty = Friction Score * 0.10 * Cart Value
    friction_penalty = friction_score * 0.10 * cart_value_inr
    
    # Risk Penalty
    risk_multipliers = {"LOW": 0.0, "MEDIUM": 50.0, "HIGH": 200.0}
    risk_penalty = risk_multipliers.get(risk_level, 0.0)
    
    erv = base_recovery_value - cost - friction_penalty - risk_penalty
    return round(max(erv, 0.0), 2)

def score_strategy_candidate(
    strategy: str,
    cart_value_inr: float,
    bank_sr: float,
    gateway_sr: float,
    user_intent_score: float,
    budget_remaining: Dict[str, int],
    target_rail_or_action: str = None
) -> StrategyScore:
    """
    Evaluates a candidate strategy and produces a detailed StrategyScore object.
    """
    if strategy == "REROUTE":
        # Rerouting to a healthy rail has high success probability and low friction
        prob = min(bank_sr * gateway_sr * 1.05, 0.96)
        friction = 0.02
        latency = 180
        risk = "LOW"
        if budget_remaining.get("max_infra_retries", 0) <= 0:
            prob = 0.10
            
    elif strategy == "UI_FLIP":
        # Interactive UI flip requires user tap, high intent boosts success
        prob = min(0.70 + (user_intent_score * 0.20), 0.92)
        friction = 0.15 # User intervention required
        latency = 80
        risk = "LOW"
        if budget_remaining.get("max_ui_flips", 0) <= 0:
            prob = 0.05
            
    elif strategy == "RETRY":
        # Simple retry on degraded bank has lower success
        prob = bank_sr * 0.85
        friction = 0.05
        latency = 350
        risk = "LOW"
        if budget_remaining.get("max_infra_retries", 0) <= 0:
            prob = 0.01

    elif strategy == "WAIT_AND_RETRY":
        # Wait for micro-downtime to resolve
        prob = 0.65
        friction = 0.10
        latency = 3000
        risk = "MEDIUM"

    elif strategy == "ASYNC_RECOVERY":
        # Out-of-band WhatsApp link for high intent carts
        prob = 0.63 if cart_value_inr >= 3000 else 0.30
        friction = 0.05
        latency = 120000
        risk = "MEDIUM"
        if budget_remaining.get("max_async_outreach", 0) <= 0:
            prob = 0.01

    else: # ABANDON
        prob = 0.0
        friction = 0.0
        latency = 0
        risk = "LOW"

    erv = calculate_expected_recovery_value(
        cart_value_inr=cart_value_inr,
        strategy=strategy,
        success_prob=prob,
        friction_score=friction,
        latency_ms=latency,
        risk_level=risk
    )

    return StrategyScore(
        strategy=strategy,
        success_probability=round(prob, 2),
        friction_score=friction,
        expected_value=erv,
        latency_ms=latency,
        risk_level=risk,
        target_rail_or_action=target_rail_or_action
    )
