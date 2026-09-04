import React, { useState } from 'react';
import { CreditCard, Smartphone, CheckCircle, XCircle, ArrowRight, RefreshCw, Zap, Lock, AlertCircle, Shield, Building2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

const PRESET_FAILURES = [
  { id: 'BANK_TIMEOUT', label: '5s Timeout', type: 'INFRA', bank: 'HDFC', desc: 'Issuer bank timed out after 5000ms' },
  { id: 'BANK_DOWN', label: 'Core Outage', type: 'INFRA', bank: 'HDFC', desc: 'Core CBS 503 Service Unavailable' },
  { id: 'INSUFFICIENT_FUNDS', label: 'Insufficient Funds', type: 'USER', bank: 'ICICI', desc: 'Card declined due to low balance' },
  { id: 'UPI_FAILED', label: 'UPI Expired', type: 'USER', bank: 'SBI', desc: 'UPI collect request session expired' },
];

export default function CheckoutSimulator({ onSimulateFailure, onConfirmUIFlip, isProcessing, recoveryResult }) {
  const [amount, setAmount] = useState(4999);
  const [selectedError, setSelectedError] = useState('BANK_TIMEOUT');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [selectedMethod, setSelectedMethod] = useState('CARD');
  const [activeTab, setActiveTab] = useState('RESILIO');
  const [standardState, setStandardState] = useState('IDLE');
  const [liveWidgetState, setLiveWidgetState] = useState('IDLE');
  const [liveError, setLiveError] = useState('');

  const handleRunStandard = () => {
    setStandardState('FAIL');
  };

  const handleRunResilio = async (overrideError, overrideBank) => {
    setStandardState('IDLE');
    const err = overrideError || selectedError;
    const bnk = overrideBank || selectedBank;
    
    const data = await onSimulateFailure({
      error_code: err,
      error_description: getErrorDesc(err, bnk),
      amount_in_cents: amount * 100,
      payment_method: selectedMethod,
      bank_name: bnk,
      gateway: 'RAZORPAY_PRIMARY'
    });

    if (data && (data.status === 'SUCCESS' || data.status === 'REQUIRES_USER')) {
      confetti({ particleCount: 55, spread: 65, origin: { y: 0.68 } });
    }
  };

  const handle1TapUPI = () => {
    if (onConfirmUIFlip) {
      onConfirmUIFlip();
      confetti({ particleCount: 65, spread: 70, origin: { y: 0.65 } });
    }
  };

  const handlePresetClick = (preset) => {
    setSelectedError(preset.id);
    setSelectedBank(preset.bank);
    handleRunResilio(preset.id, preset.bank);
  };

  const handleRunRealCheckout = async () => {
    try {
      setLiveError('');
      setLiveWidgetState('PROCESSING');
      
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK is not loaded in the browser. Please check your internet connection.');
      }

      const keyData = await api.getRazorpayKey();
      if (!keyData?.key_id) {
        throw new Error('Razorpay Key ID not configured on backend.');
      }

      const order = await api.createRazorpayOrder(amount * 100);
      const orderId = order.order_id || order.id;

      const options = {
        key: keyData.key_id,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: "RESILIO",
        description: "Live Razorpay Test Checkout",
        image: "https://razorpay.com/favicon.png",
        order_id: orderId,
        handler: async function (response) {
          setLiveWidgetState('VERIFYING');
          try {
            const verifyRes = await api.verifyPayment(response.razorpay_payment_id, response.razorpay_order_id);
            if (verifyRes.status === 'PAYMENT_VERIFIED') {
              setLiveWidgetState('SUCCESS');
              confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            } else {
              setLiveError(verifyRes.error || 'Payment verification failed on Razorpay.');
              setLiveWidgetState('FAILED');
            }
          } catch (e) {
            setLiveError(e?.response?.data?.detail || e.message || 'Payment verification failed');
            setLiveWidgetState('FAILED');
          }
        },
        prefill: {
          name: "Hackathon Tester",
          email: "test@razorpay.com",
          contact: "9999999999"
        },
        theme: {
          color: "#072654"
        },
        retry: {
          enabled: false
        },
        modal: {
          ondismiss: function() {
            setLiveError('Payment session abandoned or closed by customer.');
            setLiveWidgetState('FAILED');
          }
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', async function (response) {
        // Close modal safely using official SDK method
        try {
          rzp.close();
        } catch (e) {}

        const desc = response?.error?.description || response?.error?.reason || 'Payment declined by gateway';
        setLiveError(desc);
        setLiveWidgetState('IDLE');

        // 2. Automatically trigger RESILIO Recovery Multi-Agent flow!
        const errCode = desc.toLowerCase().includes('not supported') || desc.toLowerCase().includes('funds') || desc.toLowerCase().includes('limit')
          ? 'INSUFFICIENT_FUNDS'
          : (response?.error?.code === 'GATEWAY_ERROR' ? 'BANK_TIMEOUT' : 'BANK_DOWN');

        setActiveTab('RESILIO');
        setSelectedError(errCode);
        
        if (onSimulateFailure) {
          await onSimulateFailure({
            error_code: errCode,
            error_description: desc,
            amount_in_cents: amount * 100,
            payment_method: 'CARD',
            bank_name: selectedBank || 'HDFC',
            gateway: 'RAZORPAY_LIVE_WIDGET'
          });
        }
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.detail || err?.message || 'Could not connect to backend or Razorpay API';
      setLiveError(msg);
      setLiveWidgetState('FAILED');
    }
  };

  return (
    <div className="rzp-card-elevated p-6 flex flex-col gap-5">
      {/* Header & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="rzp-badge rzp-badge-blue font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2B84EA] animate-pulse-dot" />
              INTERACTIVE SANDBOX
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#1A202C] font-heading">
            Live Payment Simulation
          </h2>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 bg-[#F5F7FA] rounded-lg border border-[#E2E8F0] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('RESILIO')}
            className={`px-3.5 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'RESILIO'
                ? 'bg-[#2B84EA] text-white shadow-sm'
                : 'text-[#4A5568] hover:text-[#1A202C]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>RESILIO AUTONOMOUS</span>
          </button>
          <button
            onClick={() => setActiveTab('STANDARD')}
            className={`px-3.5 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'STANDARD'
                ? 'bg-[#CB3837] text-white shadow-sm'
                : 'text-[#4A5568] hover:text-[#1A202C]'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>STATIC RETRY</span>
          </button>
          <button
            onClick={() => setActiveTab('LIVE')}
            className={`px-3.5 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'LIVE'
                ? 'bg-[#1CA672] text-white shadow-sm'
                : 'text-[#4A5568] hover:text-[#1A202C]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>LIVE WIDGET</span>
          </button>
        </div>
      </div>

      {/* 1-Click Preset Shock Triggers */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-[#A0AEC0] uppercase tracking-wider">
            1-Click Failure Presets
          </span>
          <span className="text-[10px] text-[#CBD5E1] font-mono">Instant testing</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESET_FAILURES.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetClick(preset)}
              disabled={isProcessing}
              className={`p-2.5 rounded-lg border text-left transition-all active:scale-[0.97] disabled:opacity-50 ${
                selectedError === preset.id
                  ? 'bg-[#E8F1FD] border-[#2B84EA] text-[#072654]'
                  : 'bg-white border-[#E2E8F0] text-[#4A5568] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span>{preset.label}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                  preset.type === 'INFRA' ? 'rzp-badge-amber' : 'rzp-badge-purple'
                }`}>
                  {preset.type}
                </span>
              </div>
              <div className="text-[10px] text-[#A0AEC0] font-mono mt-0.5">Bank: {preset.bank}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Transaction Configuration */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#F5F7FA] p-4 rounded-xl border border-[#E2E8F0] text-xs">
        <div>
          <label className="text-[#4A5568] font-semibold block mb-1.5 text-[11px] uppercase tracking-wide">Cart Amount (INR)</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-[#A0AEC0] font-bold font-mono text-sm">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="rzp-input w-full pl-7 font-bold font-mono"
            />
          </div>
        </div>

        <div>
          <label className="text-[#4A5568] font-semibold block mb-1.5 text-[11px] uppercase tracking-wide">Issuer Bank</label>
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className="rzp-select w-full font-semibold"
          >
            <option value="HDFC">HDFC Bank</option>
            <option value="ICICI">ICICI Bank</option>
            <option value="SBI">SBI (State Bank)</option>
            <option value="AXIS">Axis Bank</option>
          </select>
        </div>

        <div>
          <label className="text-[#4A5568] font-semibold block mb-1.5 text-[11px] uppercase tracking-wide">Failure Type</label>
          <select
            value={selectedError}
            onChange={(e) => setSelectedError(e.target.value)}
            className="rzp-select w-full font-semibold"
          >
            <option value="BANK_TIMEOUT">Infrastructure Timeout (5000ms)</option>
            <option value="BANK_DOWN">Bank Server Down (Outage)</option>
            <option value="INSUFFICIENT_FUNDS">Insufficient Funds (Card Limit)</option>
            <option value="UPI_FAILED">UPI Pin / App Timeout</option>
          </select>
        </div>
      </div>

      {/* === Checkout Area === */}
      {activeTab === 'RESILIO' && (
        <div className="p-5 rounded-xl bg-white border-2 border-[#2B84EA]/20 relative overflow-hidden shadow-sm">
          {/* Top PG Bar */}
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#E8F1FD] text-[#2B84EA]">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-[#072654] tracking-wide">Razorpay Trusted Checkout</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#A0AEC0] font-mono">
              <Lock className="w-3 h-3 text-[#1CA672]" /> 256-Bit Encrypted
            </div>
          </div>

          <div className="max-w-md mx-auto space-y-5">
            <div className="text-center">
              <div className="text-[11px] font-semibold text-[#A0AEC0] tracking-wider font-mono uppercase">Amount Payable</div>
              <div className="text-3xl font-extrabold text-[#1A202C] font-heading mt-0.5 tracking-tight">
                ₹{amount.toLocaleString()}
              </div>
            </div>

            {/* Default State */}
            {!recoveryResult && !isProcessing && (
              <div className="space-y-3.5">
                <div className="p-3.5 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] space-y-2 text-xs">
                  <div className="flex justify-between text-[#4A5568]">
                    <span className="text-[#A0AEC0]">Payment Instrument:</span>
                    <span className="font-bold text-[#1A202C]">{selectedBank} {selectedMethod}</span>
                  </div>
                  <div className="flex justify-between text-[#4A5568]">
                    <span className="text-[#A0AEC0]">Primary Rail:</span>
                    <span className="text-[#2B84EA] font-mono font-medium">{selectedBank}_DIRECT_ROUTING</span>
                  </div>
                </div>

                <button
                  onClick={() => handleRunResilio()}
                  className="rzp-btn-primary w-full flex items-center justify-center gap-2 !py-3.5 !text-sm"
                >
                  <Zap className="w-4 h-4" />
                  <span>PAY ₹{amount.toLocaleString()} (TRIGGER SIMULATION)</span>
                </button>
              </div>
            )}

            {/* Processing State */}
            {isProcessing && (
              <div className="p-6 rounded-xl bg-[#E8F1FD] border border-[#2B84EA]/30 text-center space-y-3 rzp-shimmer">
                <RefreshCw className="w-8 h-8 text-[#2B84EA] animate-spin-slow mx-auto" />
                <div className="text-sm font-bold text-[#072654] font-heading">
                  Autonomous Recovery in Progress...
                </div>
                <p className="text-xs text-[#4A5568]">
                  Evaluating failure taxonomy, rail health telemetry & Expected Recovery Value (&lt;185ms)...
                </p>
              </div>
            )}

            {/* Recovered States */}
            {recoveryResult && !isProcessing && (
              <div className="space-y-4">
                {recoveryResult.status === 'SUCCESS' && (
                  <div className="p-5 rounded-xl bg-[#E6F7F0] border border-[#1CA672]/30 text-center space-y-2.5 shadow-sm">
                    <div className="w-11 h-11 rounded-full bg-[#1CA672]/15 border border-[#1CA672]/30 flex items-center justify-center mx-auto">
                      <CheckCircle className="w-6 h-6 text-[#1CA672]" />
                    </div>
                    <div className="text-base font-extrabold text-[#0D5E3F] font-heading tracking-wide">
                      Payment Recovered Successfully!
                    </div>
                    <p className="text-xs text-[#4A5568] leading-relaxed">
                      Resilio autonomously rerouted traffic from degraded <span className="font-bold text-[#1A202C]">{selectedBank}</span> rail to active{' '}
                      <span className="font-bold text-[#1CA672]">{recoveryResult.execution_result?.new_rail || 'ICICI Rail'}</span> with zero user friction.
                    </p>
                    <div className="text-[11px] font-mono text-[#4A5568] pt-2 border-t border-[#1CA672]/20 flex items-center justify-between">
                      <span>LATENCY: {recoveryResult.total_latency_ms}ms</span>
                      <span className="rzp-badge rzp-badge-green">STATUS: CAPTURED</span>
                    </div>
                  </div>
                )}

                {recoveryResult.status === 'REQUIRES_USER' && (
                  <div className="p-5 rounded-xl bg-[#E8F1FD] border border-[#2B84EA]/30 text-center space-y-3.5 shadow-sm">
                    <div className="w-11 h-11 rounded-full bg-[#2B84EA]/15 border border-[#2B84EA]/30 flex items-center justify-center mx-auto">
                      <Zap className="w-6 h-6 text-[#2B84EA]" />
                    </div>
                    <div className="text-base font-extrabold text-[#072654] font-heading">
                      1-Tap UPI Intent Flip Engaged
                    </div>
                    <p className="text-xs text-[#4A5568]">
                      Card payment faced account limit. Resilio flipped checkout to zero-friction 1-Tap UPI Intent.
                    </p>
                    <button
                      onClick={handle1TapUPI}
                      className="w-full py-3 rounded-lg bg-[#1CA672] hover:bg-[#18915F] text-white font-extrabold text-xs shadow-sm transition-all transform hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>COMPLETE 1-TAP PAYMENT VIA GPAY / PHONEPE</span>
                    </button>
                  </div>
                )}

                {recoveryResult.status === 'PARTIAL_SUCCESS' && (
                  <div className="p-5 rounded-xl bg-[#F0EEFF] border border-[#6C5CE7]/30 text-center space-y-3 shadow-sm">
                    <div className="w-11 h-11 rounded-full bg-[#6C5CE7]/15 border border-[#6C5CE7]/30 flex items-center justify-center mx-auto">
                      <Smartphone className="w-6 h-6 text-[#6C5CE7]" />
                    </div>
                    <div className="text-base font-extrabold text-[#3D2F8B] font-heading">
                      Async WhatsApp Outreach Dispatched
                    </div>
                    <p className="text-xs text-[#4A5568]">
                      High-value cart (₹{amount}). Automated 1-Click WhatsApp payment link dispatched to customer.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => handleRunResilio()}
                  className="rzp-btn-secondary w-full !py-2.5 !text-xs !font-bold"
                >
                  Simulate Another Recovery
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'STANDARD' && (
        <div className="p-5 rounded-xl bg-white border-2 border-[#CB3837]/15 relative">
          <div className="max-w-md mx-auto space-y-5 text-center">
            <div className="text-[11px] font-semibold text-[#A0AEC0] tracking-wider font-mono uppercase">Total Payable</div>
            <div className="text-3xl font-extrabold text-[#1A202C] font-heading tracking-tight">₹{amount.toLocaleString()}</div>

            {standardState === 'IDLE' ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] text-xs text-[#4A5568] text-left">
                  Traditional gateways execute a single blind retry on the same failing bank rail before abandoning.
                </div>
                <button
                  onClick={handleRunStandard}
                  className="rzp-btn-secondary w-full !py-3.5 !text-sm !font-bold"
                >
                  PAY WITH STANDARD STATIC CHECKOUT
                </button>
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-[#FDEAEA] border border-[#F5C6C6] space-y-3.5 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-[#CB3837]/15 border border-[#CB3837]/30 flex items-center justify-center mx-auto">
                  <XCircle className="w-7 h-7 text-[#CB3837]" />
                </div>
                <div className="text-lg font-extrabold text-[#CB3837] font-heading">
                  Transaction Failed — Cart Abandoned
                </div>
                <p className="text-xs text-[#4A5568]">
                  Error Code: <span className="font-mono text-[#CB3837] font-bold">{selectedError}</span> — {getErrorDesc(selectedError, selectedBank)}
                </p>
                <div className="p-3 bg-white rounded-lg text-[11px] text-[#CB3837]/80 font-mono border border-[#F5C6C6]">
                  Traditional Result: Customer abandoned cart. Rescued GMV = ₹0.
                </div>
                <button
                  onClick={() => setStandardState('IDLE')}
                  className="rzp-btn-secondary !text-xs !font-bold text-[#CB3837] border-[#F5C6C6]"
                >
                  Reset Standard Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'LIVE' && (
        <div className="p-5 rounded-xl bg-white border-2 border-[#1CA672]/20 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-[#E6F7F0] text-[#1CA672]">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-[#072654] tracking-wide">Razorpay Live API Integration</span>
            </div>
          </div>

          <div className="max-w-md mx-auto space-y-5">
            <div className="text-center">
              <div className="text-[11px] font-semibold text-[#A0AEC0] tracking-wider font-mono uppercase">Total Payable</div>
              <div className="text-3xl font-extrabold text-[#1A202C] font-heading mt-0.5 tracking-tight">₹{amount.toLocaleString()}</div>
            </div>

            {liveWidgetState === 'IDLE' && (
              <div className="space-y-3.5">
                <div className="p-3.5 rounded-lg bg-[#F5F7FA] border border-[#E2E8F0] text-xs text-[#4A5568]">
                  Click below to create a real order via Razorpay API and open the official checkout widget in test mode.
                </div>
                <button
                  onClick={handleRunRealCheckout}
                  className="w-full py-3.5 rounded-lg bg-[#1CA672] hover:bg-[#18915F] text-white font-extrabold text-sm shadow-sm transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>PAY WITH REAL WIDGET</span>
                </button>
              </div>
            )}

            {liveWidgetState === 'PROCESSING' && (
              <div className="p-6 rounded-xl bg-[#E8F1FD] border border-[#2B84EA]/30 text-center space-y-3 rzp-shimmer">
                <RefreshCw className="w-8 h-8 text-[#2B84EA] animate-spin-slow mx-auto" />
                <div className="text-sm font-bold text-[#072654] font-heading">
                  Creating Razorpay Order...
                </div>
                <p className="text-xs text-[#4A5568]">Connecting to live API to generate order_id</p>
              </div>
            )}
            
            {liveWidgetState === 'VERIFYING' && (
              <div className="p-6 rounded-xl bg-[#FFF8E6] border border-[#E5A100]/30 text-center space-y-3 rzp-shimmer">
                <RefreshCw className="w-8 h-8 text-[#E5A100] animate-spin-slow mx-auto" />
                <div className="text-sm font-bold text-[#072654] font-heading">
                  Verifying Payment...
                </div>
                <p className="text-xs text-[#4A5568]">Fetching capture status from Razorpay servers</p>
              </div>
            )}

            {liveWidgetState === 'SUCCESS' && (
              <div className="p-5 rounded-xl bg-[#E6F7F0] border border-[#1CA672]/30 text-center space-y-2.5 shadow-sm">
                <div className="w-11 h-11 rounded-full bg-[#1CA672]/15 border border-[#1CA672]/30 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6 text-[#1CA672]" />
                </div>
                <div className="text-base font-extrabold text-[#0D5E3F] font-heading tracking-wide">
                  Live Payment Successful!
                </div>
                <p className="text-xs text-[#4A5568]">
                  The transaction was successfully processed through Razorpay's real test environment.
                </p>
                <button
                  onClick={() => setLiveWidgetState('IDLE')}
                  className="rzp-btn-secondary w-full mt-2"
                >
                  Test Another Real Payment
                </button>
              </div>
            )}
            
            {liveWidgetState === 'FAILED' && (
              <div className="p-6 rounded-xl bg-[#FDEAEA] border border-[#CB3837]/30 text-center space-y-3.5 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-[#CB3837]/15 border border-[#CB3837]/30 flex items-center justify-center mx-auto">
                  <XCircle className="w-7 h-7 text-[#CB3837]" />
                </div>
                <div className="text-lg font-extrabold text-[#CB3837] font-heading">
                  Payment Failed / Interrupted
                </div>
                {liveError && (
                  <p className="text-xs text-[#E53E3E] bg-[#FFF5F5] p-2.5 rounded-lg border border-[#FEB2B2] max-w-sm mx-auto break-words font-medium">
                    {liveError}
                  </p>
                )}
                <div className="p-3 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#4A5568] text-left space-y-1">
                  <div className="font-bold text-[#072654] flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#2B84EA]" />
                    <span>Autonomous Recovery Ready</span>
                  </div>
                  <p className="text-[11px] text-[#718096]">
                    Resilio can intercept this failure, evaluate real-time bank health telemetry, and capture the payment without drop-off.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('RESILIO');
                    const errCode = (liveError || '').toLowerCase().includes('support') || (liveError || '').toLowerCase().includes('funds') || (liveError || '').toLowerCase().includes('limit')
                      ? 'INSUFFICIENT_FUNDS'
                      : 'BANK_TIMEOUT';
                    handleRunResilio(errCode, selectedBank);
                  }}
                  className="w-full py-3.5 rounded-lg bg-[#2B84EA] hover:bg-[#1A73E8] text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>RECOVER WITH RESILIO AUTONOMOUS ENGINE</span>
                </button>
                <button
                  onClick={() => setLiveWidgetState('IDLE')}
                  className="rzp-btn-secondary !text-xs !font-bold text-[#718096] border-[#CBD5E1] w-full"
                >
                  Try Razorpay Widget Again
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
  if (code === 'BANK_DOWN') return `${bank} core banking API 503 outage detected`;
  if (code === 'INSUFFICIENT_FUNDS') return `Card declined: Insufficient account funds`;
  return `UPI Intent session timed out`;
}
