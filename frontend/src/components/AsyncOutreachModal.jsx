import React from 'react';
import { Smartphone, Send, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel max-w-sm w-full rounded-3xl p-5 border border-cyan-500/40 shadow-2xl space-y-4">
        <div className="flex items-center justify-between text-xs text-gray-400 border-b border-gray-800 pb-3">
          <span className="flex items-center gap-1.5 font-bold text-white font-heading">
            <Smartphone className="w-4 h-4 text-cyan-400" /> Simulated Customer Phone
          </span>
          <button onClick={onClose} className="hover:text-white font-bold text-xs p-1 text-gray-400">✕</button>
        </div>

        {/* Mock WhatsApp Notification */}
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 space-y-3 text-xs shadow-lg">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-300 font-heading flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Razorpay Payment Recovery
            </span>
            <span className="text-[10px] text-emerald-500 font-mono">JUST NOW</span>
          </div>

          <p className="text-gray-200 leading-relaxed font-sans text-xs">
            Hi! Your payment of <span className="font-bold text-emerald-300">₹{amount.toLocaleString()}</span> faced a bank timeout. We reserved your items for 15 mins. Tap below to complete securely in 1 click!
          </p>

          <button
            onClick={handleCompletePayment}
            className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-center text-xs shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" /> COMPLETE PAYMENT NOW <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-center text-[10px] text-gray-500 font-mono">
          ASYNC RECOVERY BUDGET: 1 LINK / CART TIER &gt; ₹3,000
        </div>
      </div>
    </div>
  );
}

