import React from 'react';
import { Smartphone, ArrowRight, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AsyncOutreachModal({ isOpen, onClose, onCompletePayment, amount = 4999 }) {
  if (!isOpen) return null;

  const handleCompletePayment = (e) => {
    e.preventDefault();
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    if (onCompletePayment) {
      onCompletePayment();
    }
    onClose();
  };

  return (
    <div className="rzp-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="rzp-card-elevated max-w-sm w-full p-5 space-y-4 animate-fadeIn">
        <div className="flex items-center justify-between text-xs text-[#A0AEC0] border-b border-[#E2E8F0] pb-3">
          <span className="flex items-center gap-1.5 font-bold text-[#1A202C] font-heading">
            <Smartphone className="w-4 h-4 text-[#2B84EA]" /> Simulated Customer Phone
          </span>
          <button onClick={onClose} className="hover:text-[#1A202C] font-bold text-xs p-1 text-[#A0AEC0] transition">✕</button>
        </div>

        {/* Mock WhatsApp Notification */}
        <div className="p-4 rounded-xl bg-[#E6F7F0] border border-[#1CA672]/30 space-y-3 text-xs shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#0D5E3F] font-heading flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1CA672]" />
              Razorpay Payment Recovery
            </span>
            <span className="text-[10px] text-[#1CA672]/70 font-mono">JUST NOW</span>
          </div>

          <p className="text-[#4A5568] leading-relaxed text-xs">
            Hi! Your payment of <span className="font-bold text-[#0D5E3F]">₹{amount.toLocaleString()}</span> faced a bank timeout. We reserved your items for 15 mins. Tap below to complete securely in 1 click!
          </p>

          <button
            onClick={handleCompletePayment}
            className="w-full py-2.5 rounded-lg bg-[#1CA672] hover:bg-[#18915F] text-white font-bold text-center text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" /> COMPLETE PAYMENT NOW <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-center text-[10px] text-[#A0AEC0] font-mono">
          ASYNC RECOVERY BUDGET: 1 LINK / CART TIER &gt; ₹3,000
        </div>
      </div>
    </div>
  );
}
