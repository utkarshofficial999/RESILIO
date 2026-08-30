from app.simulation.ab_runner import run_ab_simulation

def test_ab_simulation_run():
    report = run_ab_simulation(count=100)
    assert report.total_transactions == 100
    assert report.resilio_recovery_rate >= report.control_recovery_rate
    assert report.recovery_lift_percentage_points >= 0
    assert report.resilio_gmv_rescued >= report.control_gmv_rescued
