from app.agents.graph import resilio_graph

def test_full_7_node_agent_execution():
    initial_state = {
        "transaction_id": "tx_test_graph",
        "amount_in_cents": 499900,
        "cart_value_inr": 4999.0,
        "currency": "INR",
        "merchant_id": "merch_1",
        "customer_id": "cust_1",
        "bank_name": "HDFC",
        "gateway": "Gateway_A",
        "payment_method": "CARD",
        "error_code": "BANK_TIMEOUT",
        "error_description": "HDFC bank gateway timeout",
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
        "user_intent_score": 0.88,
        "budget_remaining": {"max_infra_retries": 2, "max_ui_flips": 1, "max_async_outreach": 1},
        "start_time_ms": 0.0,
        "total_latency_ms": 0
    }

    final_state = resilio_graph.invoke(initial_state)
    
    # Verify all 7 nodes executed
    traces = final_state.get("node_traces", [])
    assert len(traces) == 7
    node_names = [t["node_name"] for t in traces]
    assert "Failure Investigator" in node_names
    assert "Telemetry Observer" in node_names
    assert "Recovery Strategist" in node_names
    assert "Recovery Optimizer" in node_names
    assert "Recovery Executor" in node_names
    assert "Recovery Verifier" in node_names
    assert "Learning Analyzer" in node_names
    
    assert final_state.get("verified_status") in ["SUCCESS", "REQUIRES_USER", "PARTIAL_SUCCESS", "ABANDONED"]
