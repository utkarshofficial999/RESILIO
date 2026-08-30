from app.memory.infra_memory import infra_memory

def get_live_telemetry(bank_name: str, gateway_name: str):
    """
    Pulls system metrics, failure logs, and live bank health across Razorpay network.
    """
    bank_data = infra_memory.get_bank_health(bank_name)
    gateway_data = infra_memory.get_gateway_health(gateway_name)
    
    # Find highest performing alternative bank
    all_banks = infra_memory.get_all_bank_telemetry()
    best_alt_bank = bank_name
    best_alt_sr = 0.0
    
    for b_name, b_info in all_banks.items():
        if b_name != bank_name and b_info["success_rate"] > best_alt_sr:
            best_alt_sr = b_info["success_rate"]
            best_alt_bank = b_name
            
    return {
        "bank_name": bank_name,
        "bank_success_rate": bank_data["success_rate"],
        "bank_status": bank_data["status"],
        "gateway_name": gateway_name,
        "gateway_success_rate": gateway_data["success_rate"],
        "best_alternative_bank": best_alt_bank,
        "best_alternative_bank_sr": best_alt_sr,
        "is_outage": bank_data["status"] in ["OUTAGE", "DEGRADED"]
    }
