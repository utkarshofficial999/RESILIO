# RESILIO — Autonomous Payment Recovery Intelligence

> **Tagline:** Every failed payment deserves another path.

RESILIO is an **autonomous payment recovery intelligence layer** designed for payment gateways like Razorpay. Instead of relying on static retry rules or generic "Transaction Failed" screens, Resilio creates a closed-loop decision layer that asks:

> **"What is the best next action to maximize the probability of recovering this payment?"**

---

## ⚡ Key Hackathon Differentiators

1. **Expected Recovery Value (ERV) Engine**:
   $$\text{ERV} = \text{Transaction Value} \times P(\text{Recovery}) - \text{Recovery Cost} - \text{Friction Penalty} - \text{Risk Penalty}$$
2. **7-Node LangGraph Multi-Agent Architecture**:
   - `Agent 1: Failure Investigator` (Classifies infrastructure vs. user intent errors)
   - `Agent 2: Telemetry Observer` (Real-time network success rates)
   - `Agent 3: Recovery Strategist` (Generates candidate actions)
   - `Agent 4: Recovery Optimizer` (Scores ERV & selects action)
   - `Agent 5: Recovery Executor` (Calls rail swap, UI flip, or async link)
   - `Agent 6: Recovery Verifier` (Confirms outcome state)
   - `Agent 7: Learning Analyzer` (Updates system memory)
3. **Auditable Counterfactual Decision Engine ("WHY THIS ACTION?")**:
   - Explains why the selected action beat alternative strategies (Retry, UI Flip, Async) with full Expected Recovery Value transparency.
4. **Signature Metric — Recovery Lift (+16.5%)**:
   - Includes a 1-Click 1,000 Synthetic Transaction Benchmark comparing traditional static retries (68.2%) vs. Resilio Autonomous Recovery (84.7%).
5. **Bank Outage Shock Simulator**:
   - Interactive trigger ("INJECT BANK OUTAGE") that instantly drops HDFC success rate to 42% and demonstrates real-time autonomous traffic rerouting to ICICI/AXIS.

---

## 🏗️ Project Architecture

```
resilio/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI server entrypoint
│   │   ├── config.py                # Environment configuration
│   │   ├── agents/                  # 7 LangGraph agent nodes
│   │   ├── policy/                  # Recovery policy engine & ERV scoring
│   │   ├── memory/                  # Infra, user, and transaction memory
│   │   ├── tools/                   # Reroute, UI flip, outreach, verification tools
│   │   ├── simulation/              # Bank simulator & A/B benchmark engine
│   │   └── api/                     # REST & WebSocket endpoints
│   └── tests/                       # Pytest test suite
├── frontend/
│   └── src/
│       ├── components/              # Agent visualizer, Counterfactual panel, Sandbox
│       ├── App.jsx                  # Main control plane application
│       └── index.css                # Glassmorphism dark mode CSS
├── docker-compose.yml
├── Makefile
└── README.md
```

---

## 🚀 Quick Start Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Run Backend Server
```bash
cd backend
pip install -r requirements.txt
python start.py
```
*Backend runs on `http://localhost:8000` (API Docs at `http://localhost:8000/docs`).*

### 2. Run Frontend Application
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`.*

### 3. Run Automated Unit Tests
```bash
$env:PYTHONPATH="backend"; python -m pytest backend/tests/
```

### 4. Run via Docker Compose
```bash
docker-compose up --build
```

---

## 🔒 Security Notice
**SIMULATION MODE — NO REAL MONEY MOVEMENT**
Resilio uses synthetic transactions and simulated bank health telemetry only. No sensitive credit card details, CVVs, or bank credentials are processed or stored.
