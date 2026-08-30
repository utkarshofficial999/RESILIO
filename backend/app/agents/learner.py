import time
from typing import Dict, Any
from app.agents.state import ResilioState
from app.memory.transaction_memory import tx_memory

def learn_outcome_node(state: ResilioState) -> Dict[str, Any]:
    """
    Agent 7 — Learning/Outcome Analyzer
    Records selected action, actual outcome, latency, and updates system memory.
    """
    tx_id = state.get("transaction_id", "tx_001")
    selected = state.get("selected_strategy", {})
    verified = state.get("verified_status", "SUCCESS")
    exec_res = state.get("execution_result", {})
    
    # Record in transaction memory
    tx_memory.record_attempt(
        tx_id=tx_id,
        strategy=selected.get("strategy", "REROUTE"),
        result_status=verified,
        details=exec_res.get("message", "")
    )
    
    summary = {
        "transaction_id": tx_id,
        "selected_strategy": selected.get("strategy"),
        "predicted_probability": selected.get("success_probability"),
        "actual_outcome": verified,
        "latency_ms": exec_res.get("latency_ms", 180),
        "feedback_loop": "UPDATED_INFRA_MEMORY"
    }
    
    trace = {
        "node_name": "Learning Analyzer",
        "agent_id": "agent_7_learner",
        "status": "COMPLETED",
        "input_payload": {"verified_status": verified},
        "output_payload": summary,
        "timestamp": time.strftime("%H:%M:%S")
    }
    
    node_traces = state.get("node_traces", [])
    node_traces.append(trace)
    
    return {
        "outcome_summary": summary,
        "node_traces": node_traces
    }
