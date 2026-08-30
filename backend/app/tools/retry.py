def retry_payment(tx_id: str, bank_name: str):
    """
    Retries transaction on existing infrastructure.
    Used for: Transient micro-errors.
    """
    print(f"[RESILIO TOOL EXECUTION] Retrying transaction {tx_id} on {bank_name}.")
    return {
        "status": "SUCCESS",
        "action": "INFRASTRUCTURE_RETRY",
        "target_bank": bank_name,
        "latency_ms": 320,
        "message": f"Retry executed on {bank_name} rail."
    }
