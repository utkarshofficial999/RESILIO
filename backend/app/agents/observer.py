import time
from typing import Dict, Any
from app.agents.state import ResilioState
from app.tools.telemetry import get_live_telemetry

def observe_telemetry_node(state: ResilioState) -> Dict[str, Any]:
    """
    Agent 2 — Market/Telemetry Observer
    Checks real-time bank success rates, gateway health, and network latency.
    """
    bank_name = state.get("bank_name", "HDFC")
    gateway_name = state.get("gateway", "Gateway_A")
    
    telemetry = get_live_telemetry(bank_name, gateway_name)
    
    trace = {
        "node_name": "Telemetry Observer",
        "agent_id": "agent_2_observer",
        "status": "COMPLETED",
        "input_payload": {"bank": bank_name, "gateway": gateway_name},
        "output_payload": telemetry,
        "timestamp": time.strftime("%H:%M:%S")
    }
    
    node_traces = state.get("node_traces", [])
    node_traces.append(trace)
    
    return {
        "telemetry_snapshot": telemetry,
        "node_traces": node_traces
    }
