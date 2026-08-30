from typing import Dict, Any
from app.simulation.transaction_generator import generate_synthetic_transactions
from app.policy.recovery_policy import policy_engine
from app.schemas.schemas import ABSimulationReport

def run_ab_simulation(count: int = 1000, outage_bank: str = None) -> ABSimulationReport:
    """
    Executes an A/B benchmark simulation over N synthetic transactions:
    - Control (Traditional System): Blind Retry ➔ Fail ➔ Abandon
    - Resilio (Autonomous Recovery): Telemetry + ERV Scoring ➔ Reroute / UI Flip / Async
    """
    transactions = generate_synthetic_transactions(count)
    
    control_recovered = 0
    control_abandoned = 0
    control_gmv_rescued = 0.0
    
    resilio_recovered = 0
    resilio_abandoned = 0
    resilio_gmv_rescued = 0.0
    
    friction_avoided_count = 0
    unnecessary_retries_avoided = 0
    strategy_dist = {"REROUTE": 0, "UI_FLIP": 0, "ASYNC_RECOVERY": 0, "RETRY": 0, "ABANDON": 0}
    
    for tx in transactions:
        cart_inr = tx["cart_value_inr"]
        bank = tx["bank_name"]
        category = tx["category"]
        
        # Simulate baseline bank success rate
        bank_sr = 0.42 if (outage_bank and bank == outage_bank) else (0.61 if bank == "HDFC" else 0.92)
        
        # --- 1. CONTROL EXECUTION (Static Retry) ---
        # Control retries 1 time blindly on same bank
        if bank_sr > 0.80 and category == "INFRASTRUCTURE":
            control_recovered += 1
            control_gmv_rescued += cart_inr
        else:
            control_abandoned += 1
            
        # --- 2. RESILIO EXECUTION (Autonomous Decision Layer) ---
        budget = {"max_infra_retries": 2, "max_ui_flips": 1, "max_async_outreach": 1}
        selected, _, _ = policy_engine.evaluate_strategies(
            tx_id=tx["transaction_id"],
            cart_value_inr=cart_inr,
            failure_category=category,
            current_bank=bank,
            current_bank_sr=bank_sr,
            best_alt_bank="ICICI",
            best_alt_bank_sr=0.95,
            user_intent_score=0.88,
            budget_remaining=budget
        )
        
        strat = selected.strategy
        strategy_dist[strat] = strategy_dist.get(strat, 0) + 1
        
        if strat == "REROUTE":
            resilio_recovered += 1
            resilio_gmv_rescued += cart_inr
            friction_avoided_count += 1
            unnecessary_retries_avoided += 1
        elif strat == "UI_FLIP":
            resilio_recovered += 1
            resilio_gmv_rescued += cart_inr
            unnecessary_retries_avoided += 1
        elif strat == "ASYNC_RECOVERY":
            if cart_inr >= 3000:
                resilio_recovered += 1
                resilio_gmv_rescued += cart_inr
            else:
                resilio_abandoned += 1
        elif strat == "RETRY":
            if bank_sr > 0.85:
                resilio_recovered += 1
                resilio_gmv_rescued += cart_inr
            else:
                resilio_abandoned += 1
        else: # ABANDON
            resilio_abandoned += 1

    control_rr = round((control_recovered / count) * 100.0, 1)
    resilio_rr = round((resilio_recovered / count) * 100.0, 1)
    lift = round(resilio_rr - control_rr, 1)
    gmv_lift = round(resilio_gmv_rescued - control_gmv_rescued, 2)
    
    return ABSimulationReport(
        total_transactions=count,
        control_recovered=control_recovered,
        control_abandoned=control_abandoned,
        control_recovery_rate=control_rr,
        control_gmv_rescued=round(control_gmv_rescued, 2),
        resilio_recovered=resilio_recovered,
        resilio_abandoned=resilio_abandoned,
        resilio_recovery_rate=resilio_rr,
        resilio_gmv_rescued=round(resilio_gmv_rescued, 2),
        recovery_lift_percentage_points=lift,
        gmv_lift_amount=gmv_lift,
        customer_friction_avoided_count=friction_avoided_count,
        unnecessary_retries_avoided_count=unnecessary_retries_avoided,
        best_strategy_distribution=strategy_dist
    )
