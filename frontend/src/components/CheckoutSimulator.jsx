import React, { useState } from 'react';
import { CreditCard, Smartphone, CheckCircle, XCircle, ArrowRight, RefreshCw, Zap, Lock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutSimulator({ onSimulateFailure, isProcessing, recoveryResult }) {
  const [amount, setAmount] = useState(4999);
  const [selectedError, setSelectedError] = useState('BANK_TIMEOUT');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [activeTab, setActiveTab] = useState('RESILIO'); // 'STANDARD' or 'RESILIO'
  const [standardState, setStandardState] = useState('IDLE'); // 'IDLE', 'FAIL'

  const handleRunStandard = () => {
    setStandardState('FAIL');
  };

  const handleRunResilio = async () => {
    setStandardState('IDLE');
    const data = await onSimulateFailure({
      error_code: selectedError,
      error_description: getErrorDesc(selectedError, selectedBank),
      amount_in_cents: amount * 100,
      payment_method: 'CARD',
      bank_name: selectedBank,
      gateway: 'Gateway_A'
    });

    if (data && (data.status === 'SUCCESS' || data.status === 'REQUIRES_USER')) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-gray-800 flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div>
          <span className="text-[10px] font-extrabold tracking-wider text-cyan-400 uppercase font-mono">
            INTERACTIVE DEMO SANDBOX
          </span>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 font-heading">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Side-by-Side Payment Checkout Simulator
          </h2>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 bg-gray-900 rounded-xl border border-gray-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('RESILIO')}
            className={`px-4 py-1.5 rounded-lg transition ${
              activeTab === 'RESILIO'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            RESILIO ANTIGRAVITY (AUTONOMOUS)
          </button>
          <button
            onClick={() => setActiveTab('STANDARD')}
            className={`px-4 py-1.5 rounded-lg transition ${
              activeTab === 'STANDARD'
                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            STANDARD CHECKOUT (STATIC RETRY)
          </button>
        </div>
      </div>

      {/* Control Configuration bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-900/60 p-4 rounded-xl border border-gray-800 text-xs">
        <div>
          <label className="text-gray-400 font-medium block mb-1">CART AMOUNT (INR)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white font-bold font-mono focus:border-cyan-500 outline-none"
          />
        </div>

        <div>
          <label className="text-gray-400 font-medium block mb-1">INITIAL PAYMENT BANK</label>
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white font-semibold outline-none focus:border-cyan-500"
          >
            <option value="HDFC">HDFC Bank (Netbanking / Card)</option>
            <option value="ICICI">ICICI Bank</option>
            <option value="SBI">SBI (State Bank of India)</option>
            <option value="AXIS">Axis Bank</option>
          </select>
        </div>

        <div>
          <label className="text-gray-400 font-medium block mb-1">SIMULATED FAILURE TYPE</label>
          <select
            value={selectedError}
            onChange={(e) => setSelectedError(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-white font-semibold outline-none focus:border-cyan-500"
          >
            <option value="BANK_TIMEOUT">Infrastructure Timeout (5000ms)</option>
            <option value="BANK_DOWN">Bank Server Down (Outage)</option>
            <option value="INSUFFICIENT_FUNDS">Insufficient Funds (Card Declined)</option>
            <option value="UPI_FAILED">UPI Pin / App Timeout</option>
          </select>
        </div>
      </div>

      {/* Checkout Screen Render */}
      {activeTab === 'RESILIO' ? (
        <div className="p-6 rounded-2xl bg-gradient-to-b from-gray-900 to-gray-950 border border-cyan-500/30 relative overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold text-gray-200">Razorpay Antigravity Payment Gateway</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
              <Lock className="w-3.5 h-3.5 text-cyan-400" /> 256-Bit Encrypted
            </div>
          </div>

          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center">
              <div className="text-xs text-gray-400 font-medium">TOTAL PAYABLE</div>
              <div className="text-3xl font-extrabold text-white font-heading mt-1">₹{amount.toLocaleString()}</div>
            </div>

            {/* Status Render */}
            {!recoveryResult && !isProcessing && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 space-y-3">
                  <div className="flex justify-between text-xs text-gray-300 font-medium">
                    <span>Payment Method:</span>
                    <span className="font-bold text-white">{selectedBank} Credit Card</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-300 font-medium">
                    <span>Target Rail:</span>
                    <span className="text-cyan-400 font-mono">Razorpay Primary PG Routing</span>
                  </div>
                </div>

                <button
                  onClick={handleRunResilio}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/20 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" /> PAY NOW ₹{amount.toLocaleString()}
                </button>
              </div>
            )}

            {isProcessing && (
              <div className="p-6 rounded-xl bg-cyan-950/40 border border-cyan-500/50 text-center space-y-3 shimmer-active">
                <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mx-auto" />
                <div className="text-sm font-bold text-cyan-200">INTERCEPTING FAILURE IN REAL TIME...</div>
                <p className="text-xs text-gray-400">Resilio LangGraph Agent evaluating ERV strategies (&lt;185ms)...</p>
              </div>
            )}

            {recoveryResult && (
              <div className="space-y-4">
                {recoveryResult.status === 'SUCCESS' && (
                  <div className="p-5 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-2">
                    <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                    <div className="text-base font-bold text-emerald-200 font-heading">
                      PAYMENT RECOVERED INSTANTLY!
                    </div>
                    <p className="text-xs text-gray-300">
                      Rerouted invisibly from degraded <span className="font-bold">{selectedBank}</span> rail to active{' '}
                      <span className="font-bold text-emerald-400">{recoveryResult.execution_result?.new_rail || 'ICICI Rail'}</span> with zero user friction.
                    </p>
                    <div className="text-[11px] font-mono text-cyan-400 pt-2 border-t border-emerald-900/50">
                      LATENCY: {recoveryResult.total_latency_ms}ms • STRATEGY: {recoveryResult.selected_strategy}
                    </div>
                  </div>
                )}

                {recoveryResult.status === 'REQUIRES_USER' && (
                  <div className="p-5 rounded-xl bg-cyan-950/40 border border-cyan-500/50 text-center space-y-3">
                    <Zap className="w-8 h-8 text-cyan-400 mx-auto" />
                    <div className="text-base font-bold text-cyan-200 font-heading">DYNAMIC UI FLIP ENGAGED</div>
                    <p className="text-xs text-gray-300">
                      Card payment faced insufficient funds. Transformed checkout into 1-Tap UPI Direct Intent.
                    </p>
                    <button className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-xs shadow-lg transition">
                      1-TAP PAY VIA PHONEPE / GPAY
                    </button>
                  </div>
                )}

                {recoveryResult.status === 'PARTIAL_SUCCESS' && (
                  <div className="p-5 rounded-xl bg-purple-950/40 border border-purple-500/50 text-center space-y-3">
                    <Smartphone className="w-8 h-8 text-purple-400 mx-auto" />
                    <div className="text-base font-bold text-purple-200 font-heading">ASYNC RECOVERY LINK DISPATCHED</div>
                    <p className="text-xs text-gray-300">
                      High value cart (₹{amount}). Automated WhatsApp checkout link dispatched to customer phone.
                    </p>
                  </div>
                )}

                <button
                  onClick={handleRunResilio}
                  className="w-full py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold border border-gray-700 transition"
                >
                  RUN SIMULATION AGAIN
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-gray-950 border border-rose-900/40 relative">
          <div className="max-w-md mx-auto space-y-6 text-center">
            <div className="text-xs text-gray-400 font-medium">TOTAL PAYABLE</div>
            <div className="text-3xl font-extrabold text-white font-heading mt-1">₹{amount.toLocaleString()}</div>

            {standardState === 'IDLE' ? (
              <button
                onClick={handleRunStandard}
                className="w-full py-3.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-sm border border-gray-700 transition"
              >
                PAY NOW WITH STANDARD CHECKOUT
              </button>
            ) : (
              <div className="p-6 rounded-xl bg-rose-950/40 border border-rose-500/50 space-y-3">
                <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
                <div className="text-lg font-bold text-rose-200 font-heading">TRANSACTION FAILED</div>
                <p className="text-xs text-gray-400">
                  Error Code: {selectedError} — {getErrorDesc(selectedError, selectedBank)}
                </p>
                <div className="p-3 bg-gray-900 rounded-lg text-[11px] text-gray-400 font-mono">
                  Traditional outcome: Customer abandoned cart. Rescued GMV = ₹0.
                </div>
                <button
                  onClick={() => setStandardState('IDLE')}
                  className="px-4 py-2 rounded-lg bg-rose-900/50 text-rose-300 text-xs font-semibold hover:bg-rose-900"
                >
                  RETRY MANUALLY
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getErrorDesc(code, bank) {
  if (code === 'BANK_TIMEOUT') return `${bank} Netbanking gateway response timed out after 5000ms`;
  if (code === 'BANK_DOWN') return `${bank} core banking API outage detected`;
  if (code === 'INSUFFICIENT_FUNDS') return `Card declined: Insufficient account funds`;
  return `UPI Intent session timed out`;
}
