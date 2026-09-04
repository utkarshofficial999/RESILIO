def trigger_ui_flip(tx_id: str, dynamic_action_type: str):
    """
    In-Flight Dynamic UI Flip Tool.
    Injects a state override payload to the frontend web/mobile checkout widget.
    Used for: Insufficient funds, User mistakes, High friction failures.
    Values for dynamic_action_type: 'UPI_DIRECT_INTENT', 'RAZORPAY_LATER_BNPL', 'ALTERNATIVE_BANK_NETBANKING'
    """
    print(f"[RESILIO TOOL EXECUTION] Injecting dynamic UI state override for {tx_id} -> {dynamic_action_type}.")
    return {
        "status": "REQUIRES_USER",
        "action": "UI_STATE_OVERRIDDEN",
        "component": dynamic_action_type,
        "latency_ms": 80,
        "customer_friction": "LOW",
        "message": f"Checkout widget transformed into 1-Tap {dynamic_action_type}."
    }
