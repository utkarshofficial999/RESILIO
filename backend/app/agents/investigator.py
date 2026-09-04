import time
from typing import Dict, Any
from app.agents.state import ResilioState
from app.schemas.schemas import FailureClassification
from app.agents.llm_client import call_groq_llm

def investigate_failure_node(state: ResilioState) -> Dict[str, Any]:
    """
    Agent 1 — Failure Investigator
    Classifies error codes into INFRASTRUCTURE vs USER_INTENT taxonomy.
    """
    error_code = state.get("error_code", "BANK_TIMEOUT")
    error_desc = state.get("error_description", "")
    
    infra_errors = ["BANK_TIMEOUT", "GATEWAY_TIMEOUT", "BANK_DOWN", "NETWORK_ERROR", "SERVER_ERROR"]
    user_errors = ["INSUFFICIENT_FUNDS", "CARD_DECLINED", "INVALID_OTP", "LIMIT_EXCEEDED", "UPI_FAILED"]
    
    if error_code in infra_errors or "timeout" in error_desc.lower() or "down" in error_desc.lower() or "down" in error_code.lower() or "50" in error_desc:
        category = "INFRASTRUCTURE"
        severity = "HIGH"
        recoverability = "HIGH"
        recommended = ["REROUTE", "RETRY", "WAIT_AND_RETRY"]
        reason = f"Infrastructure bottleneck identified on {state.get('bank_name', 'bank')} rail. System side timeout or gateway drop."
    elif error_code in user_errors or "funds" in error_desc.lower() or "declined" in error_desc.lower() or "otp" in error_desc.lower():
        category = "USER_INTENT"
        severity = "MEDIUM"
        recoverability = "MODERATE"
        recommended = ["UI_FLIP", "ASYNC_RECOVERY"]
        reason = f"Payment failure caused by user account or instrument limit. Zero-friction rail flip recommended."
    else:
        category = "INFRASTRUCTURE"
        severity = "MEDIUM"
        recoverability = "HIGH"
        recommended = ["REROUTE", "RETRY"]
        reason = f"Transient gateway issue detected for {state.get('bank_name', 'bank')}. Autonomous rail rerouting suggested."
    # Optionally enrich with Groq LLM AI Diagnosis if API key is active
    ai_prompt = f"Analyze payment failure: bank={state.get('bank_name')}, error_code={error_code}, description='{error_desc}'. In 1 concise sentence (under 25 words), diagnose the root cause for payment recovery."
    ai_diagnosis = call_groq_llm(ai_prompt)
    if ai_diagnosis:
        reason = f"[Groq AI Diagnosis] {ai_diagnosis}"
        
    classification = FailureClassification(
        category=category,
        error_code=error_code,
        severity=severity,
        recoverability=recoverability,
        confidence=0.96 if ai_diagnosis else 0.94,
        recommended_strategies=recommended,
        diagnosis_reason=reason
    ).model_dump()

    trace = {
        "node_name": "Failure Investigator",
        "agent_id": "agent_1_investigator",
        "status": "COMPLETED",
        "input_payload": {"error_code": error_code, "error_description": error_desc},
        "output_payload": classification,
        "timestamp": time.strftime("%H:%M:%S")
    }
    
    node_traces = state.get("node_traces", [])
    node_traces.append(trace)
    
    return {
        "failure_classification": classification,
        "node_traces": node_traces
    }
