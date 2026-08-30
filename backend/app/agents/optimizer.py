import time
from typing import Dict, Any
from app.agents.state import ResilioState
from app.policy.recovery_policy import policy_engine

def optimize_recovery_node(state: ResilioState) -> Dict[str, Any]:
    """
    Agent 4 — Recovery Optimizer
    Scores candidate strategies using ERV formula and produces Counterfactual Explanation.
    """
    tx_id = state.get("transaction_id", "tx_001")
    cart_inr = state.get("cart_value_inr", 4999.0)
    classification = state.get("failure_classification", {})
    telemetry = state.get("telemetry_snapshot", {})
    user_intent = state.get("user_intent_score", 0.85)
    budget = state.get("budget_remaining", {"max_infra_retries": 2, "max_ui_flips": 1, "max_async_outreach": 1})
    
    selected_score, counterfactual, scored_list = policy_engine.evaluate_strategies(
        tx_id=tx_id,
        cart_value_inr=cart_inr,
        failure_category=classification.get("category", "INFRASTRUCTURE"),
        current_bank=state.get("bank_name", "HDFC"),
        current_bank_sr=telemetry.get("bank_success_rate", 0.61),
        best_alt_bank=telemetry.get("best_alternative_bank", "ICICI"),
        best_alt_bank_sr=telemetry.get("best_alternative_bank_sr", 0.95),
        user_intent_score=user_intent,
        budget_remaining=budget
    )
    
    trace = {
        "node_name": "Recovery Optimizer",
        "agent_id": "agent_4_optimizer",
        "status": "COMPLETED",
        "input_payload": {"cart_inr": cart_inr, "user_intent": user_intent, "budget": budget},
        "output_payload": {
            "selected_strategy": selected_score.strategy,
            "expected_value": selected_score.expected_value,
            "success_prob": selected_score.success_probability,
            "why_this_action": counterfactual.why_this_action
        },
        "timestamp": time.strftime("%H:%M:%S")
    }
    
    node_traces = state.get("node_traces", [])
    node_traces.append(trace)
    
    return {
        "selected_strategy": selected_score.dict(),
        "counterfactual_explanation": counterfactual.dict(),
        "scored_strategies": [s.dict() for s in scored_list],
        "node_traces": node_traces
    }
