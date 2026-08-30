from fastapi import APIRouter
from typing import Dict, Any
from app.memory.infra_memory import infra_memory
from app.simulation.bank_simulator import inject_bank_outage, reset_bank_telemetry

router = APIRouter(prefix="/telemetry", tags=["Telemetry & Outages"])

@router.get("", summary="Get live bank and gateway telemetry")
def get_telemetry() -> Dict[str, Any]:
    return {
        "banks": infra_memory.get_all_bank_telemetry(),
        "gateways": infra_memory.gateways,
        "mode": "SIMULATION_MODE — NO REAL MONEY MOVEMENT"
    }

@router.post("/inject-outage", summary="Inject synthetic bank outage (Shock Scenario)")
def trigger_outage(bank_name: str = "HDFC", success_rate: float = 0.42):
    return inject_bank_outage(bank_name, success_rate)

@router.post("/reset", summary="Reset all telemetry to healthy baseline")
def reset_telemetry():
    return reset_bank_telemetry()
