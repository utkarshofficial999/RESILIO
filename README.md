# RESILIO — Autonomous Payment Recovery Intelligence Layer

> **Every failed payment deserves another path.**  
> An autonomous multi-agent decision layer built for modern payment platforms like Razorpay, transforming payment drop-offs into captured GMV in real time.

---

## The Problem: The Invisible Checkout Drain

Every day across India's digital economy, millions of transactions fail at the finish line:
* **Silent Banking Core Outages:** When an issuing bank's Core Banking System (CBS) experiences latency spikes or drops below 50% success rate, customers receive generic `"Transaction Failed"` screens.
* **Blind Retries:** Traditional payment gateways either do nothing or blindly retry on the exact same failing bank rail, causing repeat failures.
* **Customer Churn:** Frustrated shoppers abandon their carts, wasting merchant marketing spend (CAC) and permanently eroding trust.

**RESILIO** replaces static retry heuristics with an **autonomous closed-loop intelligence layer** that intercepts failure telemetry in under **185ms** and computes the mathematically optimal recovery path.

---

## Core Pillars & Innovations

### 1. Expected Recovery Value (ERV) Decision Engine
Unlike rule-based if/else statements, RESILIO evaluates recovery options through a real-time counterfactual optimization model:

$$\text{ERV}(s) = P(\text{Success} \mid s, \text{Telemetry}) \times \text{CartValue} - \text{FrictionCost}(s) - \text{GatewayFee}(s) - \text{LatencyPenalty}(s)$$

Where:
* **$P(\text{Success})$**: Dynamic Bayesian success probability derived from live bank telemetry.
* **$\text{CartValue}$**: Total order value in INR.
* **$\text{FrictionCost}$**: Quantified cognitive burden on the customer (0 for zero-friction reroutes, moderate for 1-tap UPI, high for manual form re-entry).
* **$\text{GatewayFee}$**: Interchange and rail routing expense.

### 2. 7-Node Multi-Agent LangGraph Workflow
RESILIO operates via a coordinated graph of specialized autonomous agents:

```
                  ┌──────────────────────┐
                  │ 1. Failure Ingest    │
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │ 2. Diagnostician     │  (Infra vs. User intent taxonomy)
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │ 3. Telemetry Observer│  (Real-time rail health & CBS metrics)
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │ 4. Strategist        │  (Candidate generation: Reroute, Flip, Outreach)
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │ 5. ERV Optimizer     │  (Counterfactual matrix evaluation)
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │ 6. Executor          │  (Zero-friction reroute or 1-tap UPI trigger)
                  └──────────┬───────────┘
                             ▼
                  ┌──────────────────────┐
                  │ 7. Verifier & Learner│  (Capture confirmation & memory update)
                  └──────────────────────┘
```

### 3. Auditable Counterfactual Reasoning ("Why This Action?")
For every decision made, RESILIO outputs an auditable decision breakdown comparing the chosen action against all alternatives (e.g. why `REROUTE` beat `STATIC RETRY` or `UI FLIP`), providing full visibility to engineering and finance teams.

### 4. 1-Click 1,000 Transaction A/B Benchmark
Includes a built-in statistical benchmarking suite:
* **Control Group (Standard Static Retry):** Recovers ~68.2% of transactions.
* **Test Group (RESILIO Autonomous Engine):** Recovers ~84.7% of transactions.
* **Net Recovery Lift:** **+16.5% captured GMV** with zero merchant intervention.

### 5. Live Razorpay Gateway Integration
Connects directly to Razorpay's API:
* Generates live test orders (`/api/v1/razorpay/create-order`).
* Securely retrieves public merchant keys for frontend checkout (`/api/v1/razorpay/key`).
* Intercepts real Razorpay `payment.failed` gateway errors and triggers recovery.
* Verifies completed payments and captures records in real time.

---

## Repository Structure

```
resilio/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI application setup and middleware
│   │   ├── config.py                # Environment settings and API keys
│   │   ├── agents/                  # 7 LangGraph autonomous recovery agents
│   │   │   ├── graph.py             # Agent workflow state graph
│   │   │   ├── diagnostician.py     # Failure taxonomy & root cause analysis
│   │   │   ├── strategist.py        # Recovery candidate generator
│   │   │   ├── optimizer.py         # ERV scoring & counterfactual ranker
│   │   │   ├── executor.py          # Action execution router
│   │   │   ├── verifier.py          # Post-execution verification
│   │   │   └── learner.py           # Contextual memory updates
│   │   ├── policy/                  # Constraints, thresholds & ERV formulas
│   │   ├── memory/                  # Infrastructure and user intent memory
│   │   ├── integrations/            # Razorpay API client wrapper
│   │   ├── simulation/              # Bank outage simulator & A/B benchmark engine
│   │   └── api/                     # REST routers & WebSocket logs
│   ├── tests/                       # Unit tests for policy, agents, and APIs
│   └── start.py                     # Development server entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx                   # Outage injection & benchmark controls
│   │   │   ├── CheckoutSimulator.jsx        # Sandbox, presets, and live checkout
│   │   │   ├── AutonomousIntelligenceHub.jsx # Multi-agent traces & counterfactuals
│   │   │   ├── LiveRecoveryModal.jsx        # In-front recovery execution modal
│   │   │   ├── ExecutiveAnalytics.jsx       # Real-time recovery KPIs & GMV metrics
│   │   │   ├── TransactionTimeline.jsx      # Audit ledger of all recovered events
│   │   │   ├── ABSimulationModal.jsx        # 1,000 transaction comparison report
│   │   │   └── AsyncOutreachModal.jsx       # WhatsApp 1-click recovery preview
│   │   ├── services/api.js                  # Axios client for backend endpoints
│   │   ├── App.jsx                          # Main dashboard container
│   │   └── index.css                        # Design system & custom styles
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## Quickstart Guide

### Prerequisites
* **Python 3.10+**
* **Node.js 18+**
* Razorpay Test API Key (optional, defaults to test sandbox)

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python start.py
```
* Backend starts at `http://localhost:8000`
* Interactive OpenAPI documentation available at `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
* Frontend starts at `http://localhost:3000`

### 3. Environment Configuration
Create a `.env` file in the project root:
```env
PORT=8000
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
LLM_PROVIDER=groq # or gemini / fallback
GROQ_API_KEY=your_key_here
```
*(Note: If no LLM key is provided, RESILIO smoothly falls back to deterministic ERV policy heuristics).*

### 4. Running Tests
```bash
# Run backend pytest suite
$env:PYTHONPATH="backend"; python -m pytest backend/tests/
```

---

## Interactive Demo Walkthrough

### Scenario A: Real-Time Rail Failure & Reroute
1. In the header bar, click **"Inject Bank Outage"**.
2. Notice HDFC Bank success rate drops instantly from 94% to 42% on the live telemetry observer.
3. Trigger an HDFC payment in the sandbox.
4. RESILIO detects that HDFC's expected value has plummeted, autonomously shifts the route to active ICICI rails, and captures the funds in `<150ms`.

### Scenario B: 1-Tap UPI Intent Flip
1. Select the **"Insufficient Funds"** or **"Card Limit"** preset.
2. Direct retries on the card rail would yield $P(\text{Success}) = 0\%$.
3. RESILIO triggers a **1-Tap UPI Intent switch**, allowing the customer to approve the cart instantly on PhonePe or Google Pay with zero drop-off.

### Scenario C: Live Razorpay Test Mode Checkout
1. Switch to the **LIVE WIDGET** tab and click **"PAY WITH REAL WIDGET"**.
2. Select any bank and click **"Failure"** on the bank test screen.
3. RESILIO intercepts the live decline payload, closes the default screen, and presents the **Autonomous Recovery Modal**.
4. Click **"COMPLETE PAYMENT VIA RECOVERED RAIL"** and select **"Success"**.
5. Check your actual **Razorpay Merchant Dashboard** (`dashboard.razorpay.com/app/payments`) to see the green `✓ Captured` payment.

---

## Security & Reliability

* **Simulation Guard:** All synthetic testing is isolated from real money movement.
* **Public Key Protection:** Secret keys are strictly retained within backend memory; only public `key_id` values are exposed to the client.
* **Stateless Agents:** Agent states are cleanly serialized using Pydantic schemas, preventing cross-request race conditions.

---

## License
MIT License. Built for the Razorpay Hackathon.
