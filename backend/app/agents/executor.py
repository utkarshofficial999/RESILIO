import time
from typing import Dict, Any
from app.agents.state import ResilioState
from app.tools.reroute import reroute_payment_rail
from app.tools.retry import retry_payment
from app.tools.ui_flip import trigger_ui_flip
from app.tools.outreach import schedule_async_recovery_link

def execute_recovery_node(state: ResilioState) -> Dict[str, Any]:
    """
    Agent 5 — Recovery Executor
    Calls actual recovery tools based on selected strategy.
    """
    tx_id = state.get("transaction_id", "tx_001")
    selected = state.get("selected_strategy", {})
    strat = selected.get("strategy", "REROUTE")
    target_rail = selected.get("target_rail_or_action", "ICICI_RAIL")
    
    if strat == "REROUTE":
        res = reroute_payment_rail(tx_id, target_rail)
    elif strat == "UI_FLIP":
        res = trigger_ui_flip(tx_id, target_rail or "UPI_DIRECT_INTENT")
    elif strat == "RETRY":
        res = retry_payment(tx_id, state.get("bank_name", "HDFC"))
    elif strat == "ASYNC_RECOVERY":
        res = schedule_async_recovery_link(tx_id, "WHATSAPP")
    else:
        res = {
            "status": "ABANDONED",
            "action": "SAFETY_ABANDON",
            "latency_ms": 0,
            "message": "Transaction safely abandoned to prevent customer friction or unnecessary charges."
        }
        
    trace = {
        "node_name": "Recovery Executor",
        "agent_id": "agent_5_executor",
        "status": "COMPLETED",
        "input_payload": {"strategy": strat, "target": target_rail},
        "output_payload": res,
        "timestamp": time.strftime("%H:%M:%S")
    }
    
    node_traces = state.get("node_traces", [])
    node_traces.append(trace)
    
    return {
        "execution_result": res,
        "node_traces": node_traces
    }
