def verify_recovery_outcome(tx_id: str, action_status: str) -> str:
    """
    Recovery Verifier Tool.
    Determines final status: SUCCESS, PARTIAL_SUCCESS, FAILED, REQUIRES_USER, ABANDONED
    """
    if action_status in ["TRAFFIC_REROUTED", "INFRASTRUCTURE_RETRY"]:
        return "SUCCESS"
    elif action_status == "UI_STATE_OVERRIDDEN":
        return "REQUIRES_USER"
    elif action_status == "ASYNC_LINK_DISPATCHED":
        return "PARTIAL_SUCCESS"
    else:
        return "ABANDONED"
