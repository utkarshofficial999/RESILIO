from typing import Dict, Any

class RecoveryConstraints:
    """
    Enforces policy guardrails and recovery budget limits.
    Prevents infinite retries, spamming async messages, and excessive friction.
    """
    
    @staticmethod
    def is_action_allowed(strategy: str, budget: Dict[str, int]) -> bool:
        if strategy in ["REROUTE", "RETRY"]:
            return budget.get("max_infra_retries", 0) > 0
        elif strategy == "UI_FLIP":
            return budget.get("max_ui_flips", 0) > 0
        elif strategy == "ASYNC_RECOVERY":
            return budget.get("max_async_outreach", 0) > 0
        elif strategy in ["WAIT_AND_RETRY", "ABANDON"]:
            return True
        return False

    @staticmethod
    def filter_allowed_strategies(candidate_scores: list, budget: Dict[str, int]) -> list:
        valid_candidates = []
        for item in candidate_scores:
            if RecoveryConstraints.is_action_allowed(item.strategy, budget):
                valid_candidates.append(item)
        if not valid_candidates:
            # Fallback to ABANDON if budget exhausted
            for item in candidate_scores:
                if item.strategy == "ABANDON":
                    valid_candidates.append(item)
                    break
        return valid_candidates
