from langgraph.graph import StateGraph, END
from app.agents.state import ResilioState
from app.agents.investigator import investigate_failure_node
from app.agents.observer import observe_telemetry_node
from app.agents.strategist import generate_strategies_node
from app.agents.optimizer import optimize_recovery_node
from app.agents.executor import execute_recovery_node
from app.agents.verifier import verify_recovery_node
from app.agents.learner import learn_outcome_node

def build_resilio_graph():
    """
    Compiles the Resilio 7-Node Multi-Agent LangGraph Workflow:
    Investigator ➔ Observer ➔ Strategist ➔ Optimizer ➔ Executor ➔ Verifier ➔ Learner
    """
    workflow = StateGraph(ResilioState)

    workflow.add_node("investigator", investigate_failure_node)
    workflow.add_node("observer", observe_telemetry_node)
    workflow.add_node("strategist", generate_strategies_node)
    workflow.add_node("optimizer", optimize_recovery_node)
    workflow.add_node("executor", execute_recovery_node)
    workflow.add_node("verifier", verify_recovery_node)
    workflow.add_node("learner", learn_outcome_node)

    workflow.set_entry_point("investigator")
    workflow.add_edge("investigator", "observer")
    workflow.add_edge("observer", "strategist")
    workflow.add_edge("strategist", "optimizer")
    workflow.add_edge("optimizer", "executor")
    workflow.add_edge("executor", "verifier")
    workflow.add_edge("verifier", "learner")
    workflow.add_edge("learner", END)

    return workflow.compile()

resilio_graph = build_resilio_graph()
