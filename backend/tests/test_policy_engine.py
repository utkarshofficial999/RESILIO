import pytest
from app.policy.scoring import calculate_expected_recovery_value, score_strategy_candidate
from app.policy.recovery_policy import policy_engine

def test_expected_recovery_value_calculation():
    # Cart ₹5,000, Success prob 90%, cost ₹12, low friction
    erv = calculate_expected_recovery_value(
        cart_value_inr=5000.0,
        strategy="REROUTE",
        success_prob=0.90,
        friction_score=0.02,
        latency_ms=180,
        risk_level="LOW"
    )
    # 5000 * 0.90 - 12 - (0.02*0.10*5000) = 4500 - 12 - 10 = 4478
    assert erv > 4400

def test_policy_engine_counterfactuals():
    selected, explanation, scores = policy_engine.evaluate_strategies(
        tx_id="tx_test_1",
        cart_value_inr=4999.0,
        failure_category="INFRASTRUCTURE",
        current_bank="HDFC",
        current_bank_sr=0.61,
        best_alt_bank="ICICI",
        best_alt_bank_sr=0.95,
        user_intent_score=0.85,
        budget_remaining={"max_infra_retries": 2, "max_ui_flips": 1, "max_async_outreach": 1}
    )
    assert selected.strategy == "REROUTE"
    assert explanation.selected_strategy == "REROUTE"
    assert len(explanation.alternatives) == 5
