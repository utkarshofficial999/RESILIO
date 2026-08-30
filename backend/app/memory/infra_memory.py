from typing import Dict, Any

class InfrastructureMemory:
    """
    Tracks live and historical performance metrics across banks and gateways.
    Allows real-time bank outage injection for shock testing.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(InfrastructureMemory, cls).__new__(cls)
            cls._instance._init_memory()
        return cls._instance

    def _init_memory(self):
        self.banks: Dict[str, Dict[str, Any]] = {
            "HDFC": {"success_rate": 0.94, "latency_ms": 120, "error_rate": 0.06, "status": "HEALTHY"},
            "ICICI": {"success_rate": 0.95, "latency_ms": 95, "error_rate": 0.05, "status": "HEALTHY"},
            "SBI": {"success_rate": 0.78, "latency_ms": 320, "error_rate": 0.22, "status": "DEGRADED"},
            "AXIS": {"success_rate": 0.91, "latency_ms": 110, "error_rate": 0.09, "status": "HEALTHY"},
        }
        self.gateways: Dict[str, Dict[str, Any]] = {
            "Gateway_A": {"success_rate": 0.92, "latency_ms": 140, "status": "HEALTHY"},
            "Gateway_B": {"success_rate": 0.96, "latency_ms": 110, "status": "HEALTHY"},
            "Gateway_C": {"success_rate": 0.85, "latency_ms": 250, "status": "DEGRADED"},
        }

    def inject_outage(self, bank_name: str, new_success_rate: float = 0.42):
        if bank_name in self.banks:
            self.banks[bank_name]["success_rate"] = new_success_rate
            self.banks[bank_name]["error_rate"] = round(1.0 - new_success_rate, 2)
            self.banks[bank_name]["status"] = "OUTAGE" if new_success_rate < 0.50 else "DEGRADED"
            self.banks[bank_name]["latency_ms"] += 450
            return True
        return False

    def reset_outages(self):
        self._init_memory()

    def get_bank_health(self, bank_name: str) -> Dict[str, Any]:
        return self.banks.get(bank_name, {"success_rate": 0.75, "latency_ms": 200, "error_rate": 0.25, "status": "UNKNOWN"})

    def get_gateway_health(self, gateway_name: str) -> Dict[str, Any]:
        return self.gateways.get(gateway_name, {"success_rate": 0.80, "latency_ms": 180, "status": "UNKNOWN"})

    def get_all_bank_telemetry(self) -> Dict[str, Dict[str, Any]]:
        return self.banks

infra_memory = InfrastructureMemory()
