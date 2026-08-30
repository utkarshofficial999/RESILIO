from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    assert res.json()["status"] == "HEALTHY"

def test_recovery_process_api():
    payload = {
        "error_code": "BANK_TIMEOUT",
        "error_description": "HDFC netbanking gateway timeout",
        "amount_in_cents": 499900,
        "payment_method": "CARD",
        "bank_name": "HDFC",
        "gateway": "Gateway_A"
    }
    res = client.post("/api/v1/recovery/process", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "transaction_id" in data
    assert "counterfactual_explanation" in data
    assert len(data["node_traces"]) == 7

def test_telemetry_outage_api():
    res = client.post("/api/v1/telemetry/inject-outage?bank_name=HDFC&success_rate=0.42")
    assert res.status_code == 200
    assert res.json()["new_success_rate"] == 0.42

def test_demo_run_api():
    res = client.post("/api/v1/demo/run", json={"total_transactions": 50})
    assert res.status_code == 200
    assert res.json()["total_transactions"] == 50
