import time
from typing import Dict, Any
from app.agents.state import ResilioState

def generate_strategies_node(state: ResilioState) -> Dict[str, Any]:
    """
    Agent 3 — Recovery Strategist
    Generates candidate list of recovery actions based on failure category and telemetry.
    """
    classification = state.get("failure_classification", {})
    recommended = classification.get("recommended_strategies", ["REROUTE", "UI_FLIP"])
    
    # Standard candidate list
    all_candidates = ["REROUTE", "UI_FLIP", "RETRY", "WAIT_AND_RETRY", "ASYNC_RECOVERY", "ABANDON"]
    
    trace = {
        "node_name": "Recovery Strategist",
        "agent_id": "agent_3_strategist",
        "status": "COMPLETED",
        "input_payload": {"category": classification.get("category"), "recommended": recommended},
        "output_payload": {"candidates": all_candidates},
        "timestamp": time.strftime("%H:%M:%S")
    }
    
    node_traces = state.get("node_traces", [])
    node_traces.append(trace)
    
    return {
        "candidate_strategies": all_candidates,
        "node_traces": node_traces
    }
