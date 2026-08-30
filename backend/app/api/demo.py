from fastapi import APIRouter
from app.schemas.schemas import ABSimulationRequest, ABSimulationReport
from app.simulation.ab_runner import run_ab_simulation

router = APIRouter(prefix="/demo", tags=["Signature Demo"])

@router.post("/run", response_model=ABSimulationReport, summary="Run 1-Click Resilio A/B Simulation (1,000 Transactions)")
def run_demo_simulation(payload: ABSimulationRequest):
    return run_ab_simulation(count=payload.total_transactions, outage_bank=payload.outage_bank)
