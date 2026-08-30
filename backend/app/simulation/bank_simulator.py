from app.memory.infra_memory import infra_memory

def inject_bank_outage(bank_name: str = "HDFC", success_rate: float = 0.42):
    """
    Simulates a sudden bank outage (e.g. HDFC success rate drops from 94% to 42%).
    """
    success = infra_memory.inject_outage(bank_name, success_rate)
    return {
        "bank_name": bank_name,
        "new_success_rate": success_rate,
        "status": "OUTAGE",
        "message": f"Simulated bank outage injected on {bank_name}. Success rate dropped to {int(success_rate*100)}%."
    }

def reset_bank_telemetry():
    infra_memory.reset_outages()
    return {"message": "All bank telemetry reset to healthy baseline."}
