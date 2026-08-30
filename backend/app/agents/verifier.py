import time
from typing import Dict, Any
from app.agents.state import ResilioState
from app.tools.verification import verify_recovery_outcome

def verify_recovery_node(state: ResilioState) -> Dict[str, Any]:
    """
    Agent 6 — Recovery Verifier
    Determines final status: SUCCESS, PARTIAL_SUCCESS, FAILED, REQUIRES_USER, ABANDONED
    """
    exec_res = state.get("execution_result", {})
    action_status = exec_res.get("action", "")
    
    verified_status = verify_recovery_outcome(state.get("transaction_id", "tx_001"), action_status)
    
    trace = {
        "node_name": "Recovery Verifier",
        "agent_id": "agent_6_verifier",
        "status": "COMPLETED",
        "input_payload": {"action_status": action_status},
        "output_payload": {"verified_status": verified_status},
        "timestamp": time.strftime("%H:%M:%S")
    }
    
    node_traces = state.get("node_traces", [])
    node_traces.append(trace)
    
    return {
        "verified_status": verified_status,
        "node_traces": node_traces
    }
