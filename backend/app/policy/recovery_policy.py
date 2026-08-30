from typing import List, Dict, Any, Tuple
from app.schemas.schemas import StrategyScore, CounterfactualExplanation, CounterfactualAlternative
from app.policy.scoring import score_strategy_candidate
from app.policy.constraints import RecoveryConstraints

class RecoveryPolicyEngine:
    """
    Core Deterministic Recovery Policy Engine.
    Generates candidate recovery strategies, scores each with ERV,
    and produces auditable Counterfactual Explanations.
    """
    
    def evaluate_strategies(
        self,
        tx_id: str,
        cart_value_inr: float,
        failure_category: str,
        current_bank: str,
        current_bank_sr: float,
        best_alt_bank: str,
        best_alt_bank_sr: float,
        user_intent_score: float,
        budget_remaining: Dict[str, int]
    ) -> Tuple[StrategyScore, CounterfactualExplanation, List[StrategyScore]]:
        
        candidates = ["REROUTE", "UI_FLIP", "RETRY", "WAIT_AND_RETRY", "ASYNC_RECOVERY", "ABANDON"]
        scored_candidates: List[StrategyScore] = []
        
        for strat in candidates:
            target_rail = None
            if strat == "REROUTE":
                target_rail = f"{best_alt_bank}_NETBANKING" if failure_category == "INFRASTRUCTURE" else "ICICI_RAIL"
            elif strat == "UI_FLIP":
                target_rail = "UPI_DIRECT_INTENT"
            elif strat == "ASYNC_RECOVERY":
                target_rail = "WHATSAPP_CHECKOUT_LINK"
                
            score = score_strategy_candidate(
                strategy=strat,
                cart_value_inr=cart_value_inr,
                bank_sr=best_alt_bank_sr if strat == "REROUTE" else current_bank_sr,
                gateway_sr=0.95,
                user_intent_score=user_intent_score,
                budget_remaining=budget_remaining,
                target_rail_or_action=target_rail
            )
            scored_candidates.append(score)
            
        # Filter allowed by recovery budget
        allowed = RecoveryConstraints.filter_allowed_strategies(scored_candidates, budget_remaining)
        
        # Sort by Expected Recovery Value (ERV) descending
        allowed.sort(key=lambda x: x.expected_value, reverse=True)
        
        for idx, item in enumerate(allowed):
            item.rank = idx + 1
            
        selected = allowed[0]
        
        # Build Counterfactual Explanation
        alternatives: List[CounterfactualAlternative] = []
        for cand in scored_candidates:
            if cand.strategy != selected.strategy:
                reason = f"Lower expected value (₹{cand.expected_value:.0f} vs ₹{selected.expected_value:.0f})"
                if cand.strategy == "RETRY":
                    reason = f"{current_bank} currently has degraded success rate ({int(current_bank_sr*100)}%). Direct retry has low expected value."
                elif cand.strategy == "UI_FLIP":
                    reason = f"Requires customer intervention. Rerouting resolves the issue with zero friction."
                elif cand.strategy == "ASYNC_RECOVERY":
                    reason = f"Asynchronous recovery introduces high latency (120s+). In-flight recovery is preferred."
                    
                alternatives.append(CounterfactualAlternative(
                    strategy=cand.strategy,
                    expected_recovery_prob=cand.success_probability,
                    expected_value=cand.expected_value,
                    friction="LOW" if cand.friction_score < 0.05 else "MEDIUM" if cand.friction_score < 0.20 else "HIGH",
                    reasoning=reason
                ))
                
        why_reasoning = f"{current_bank} currently has a {int(current_bank_sr*100)}% success rate, while {best_alt_bank} is operating at {int(best_alt_bank_sr*100)}%. {selected.strategy} delivers the highest Expected Recovery Value (₹{selected.expected_value:.0f}) with minimal customer friction."
        if selected.strategy == "UI_FLIP":
            why_reasoning = f"User Intent Score is high ({user_intent_score}). Offering a 1-tap UPI Direct Intent switch bypasses the failing card network entirely."
        elif selected.strategy == "ASYNC_RECOVERY":
            why_reasoning = f"High-value cart (₹{cart_value_inr:.0f}) abandoned during checkout. Scheduling automated WhatsApp checkout link to preserve buy intent."

        explanation = CounterfactualExplanation(
            transaction_id=tx_id,
            selected_strategy=selected.strategy,
            selected_expected_value=selected.expected_value,
            why_this_action=why_reasoning,
            alternatives=alternatives
        )
        
        return selected, explanation, scored_candidates

policy_engine = RecoveryPolicyEngine()
