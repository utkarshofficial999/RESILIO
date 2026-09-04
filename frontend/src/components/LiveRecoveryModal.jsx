import React from 'react';
import { Zap, CheckCircle2, ArrowRight, ShieldCheck, Smartphone, RefreshCw, X, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LiveRecoveryModal({ isOpen, onClose, result, amount = 4999, onConfirmPayment }) {
  if (!isOpen || !result) return null;

  const strategy = result.selected_strategy || 'REROUTE';
  const isUIFlip = result.status === 'REQUIRES_USER' || strategy === 'UI_FLIP';
  const isAsync = result.status === 'PARTIAL_SUCCESS' || strategy === 'ASYNC_OUTREACH';
  const erv = result.expected_recovery_value || (amount * 0.94);
  const latency = result.total_latency_ms || 142;

  const handlePay = () => {
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.55 } });
    if (onConfirmPayment) {
      onConfirmPayment();
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-[#072654]/80 backdrop-blur-md flex items-center justify-center p-4"
      style={{ zIndex: 99999999 }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-[#2B84EA] max-w-lg w-full overflow-hidden animate-fadeIn text-[#1A202C]">
        <div className="bg-[#072654] px-6 py-4 text-white flex items-center justify-between border-b border-[#2B84EA]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#2B84EA] flex items-center justify-center text-white shadow-sm">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="text-sm font-extrabold tracking-wide uppercase font-heading flex items-center gap-1.5">
                <span>RESILIO AUTONOMOUS RECOVERY</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1CA672] font-mono font-bold">ACTIVE</span>
              </div>
              <div className="text-[11px] text-blue-200/80">Closed-Loop Payment Resilience Layer</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="p-3.5 rounded-xl bg-[#FFF5F5] border border-[#FEB2B2] flex items-start gap-3 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-[#E53E3E] mt-1 shrink-0 animate-pulse" />
            <div className="space-y-0.5">
              <span className="font-bold text-[#C53030]">Primary Gateway Payment Failed</span>
              <p className="text-[#742A2A]">
                Issuer bank timed out or declined transaction. Resilio multi-agent engine intercepted the drop-off in <span className="font-mono font-bold">{latency}ms</span>.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#F0F7FF] border border-[#BEE3F8] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2B84EA] uppercase tracking-wider font-mono">
                Winning Autonomous Path
              </span>
              <span className="rzp-badge rzp-badge-green font-mono text-[10px]">
                ERV: ₹{Number(erv).toFixed(0)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#2B84EA]/10 border border-[#2B84EA]/30 flex items-center justify-center text-[#2B84EA] shrink-0">
                {isUIFlip ? <Smartphone className="w-6 h-6" /> : <RefreshCw className="w-6 h-6" />}
              </div>
              <div>
                <div className="text-base font-extrabold text-[#072654] font-heading">
                  {isUIFlip ? '1-Tap UPI Intent Switch' : (isAsync ? '1-Click WhatsApp Recovery' : 'Automated Gateway Reroute (ICICI)')}
                </div>
                <p className="text-xs text-[#4A5568]">
                  {isUIFlip 
                    ? 'Card limit avoided. Switched to high-converting 1-Tap UPI Intent.'
                    : (isAsync ? 'High-value cart. Reserved inventory with 1-click recovery.' : 'Traffic shifted from degraded bank CBS to 98% active ICICI rail.')}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#718096] font-semibold">Total Order Amount:</span>
              <span className="text-xl font-extrabold text-[#1A202C] font-heading">₹{amount.toLocaleString()}</span>
            </div>

            <button
              onClick={handlePay}
              className="w-full py-4 rounded-xl bg-[#1CA672] hover:bg-[#168E61] text-white font-extrabold text-sm shadow-lg shadow-[#1CA672]/30 transition-all transform hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isUIFlip ? (
                <>
                  <Smartphone className="w-5 h-5" />
                  <span>PAY ₹{amount.toLocaleString()} VIA 1-TAP GPAY / PHONEPE</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>COMPLETE PAYMENT VIA RECOVERED RAIL (₹{amount.toLocaleString()})</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-[#A0AEC0] flex items-center gap-1 font-mono text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1CA672]" /> 100% Zero Drop-Off Guarantee
            </span>
            <button 
              onClick={onClose}
              className="text-[#2B84EA] hover:underline font-bold text-[11px]"
            >
              View Multi-Agent Telemetry →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
