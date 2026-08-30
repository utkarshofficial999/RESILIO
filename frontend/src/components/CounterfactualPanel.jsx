import React from 'react';
import { HelpCircle, CheckCircle, TrendingUp, AlertCircle, ShieldAlert } from 'lucide-react';

export default function CounterfactualPanel({ counterfactual }) {
  if (!counterfactual) {
    return (
      <div className="glass-panel rounded-2xl p-6 text-center text-gray-500 border border-gray-800">
        <HelpCircle className="w-8 h-8 mx-auto mb-2 text-gray-600" />
        <p className="text-sm font-medium">No counterfactual audit data loaded.</p>
        <p className="text-xs text-gray-600">Simulate a payment failure to view decision reasoning.</p>
      </div>
    );
  }

  const { selected_strategy, selected_expected_value, why_this_action, alternatives = [] } = counterfactual;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-gray-800 flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <span className="text-[10px] font-extrabold tracking-wider text-cyan-400 uppercase font-mono">
            AUDITABLE REASONING ENGINE
          </span>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            WHY RESILIO CHOSE THIS ACTION
          </h2>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold text-gray-400">EXPECTED RECOVERY VALUE</div>
          <div className="text-xl font-extrabold text-emerald-400 font-heading">
            ₹{selected_expected_value ? selected_expected_value.toLocaleString() : '4,702'}
          </div>
        </div>
      </div>

      {/* Selected Action Highlight */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/60 to-blue-950/40 border border-cyan-500/40 text-cyan-200">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 font-mono mb-1">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          SELECTED STRATEGY: {selected_strategy}
        </div>
        <p className="text-xs text-gray-300 leading-relaxed font-sans mt-1">{why_this_action}</p>
      </div>

      {/* Counterfactual Matrix */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 font-mono">
          EVALUATED ALTERNATIVES & COUNTERFACTUAL SCORES
        </h3>

        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {alternatives.map((alt, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-gray-900/60 border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs hover:border-gray-700 transition"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 font-bold text-gray-200">
                  <span>{alt.strategy}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-400 font-mono">
                    FRICTION: {alt.friction}
                  </span>
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5">{alt.reasoning}</div>
              </div>

              <div className="flex items-center gap-4 text-right">
                <div>
                  <div className="text-[10px] text-gray-500 font-mono">PROBABILITY</div>
                  <div className="font-semibold text-gray-300">{intPercent(alt.expected_recovery_prob)}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-500 font-mono">EXPECTED VALUE</div>
                  <div className="font-bold text-amber-400">₹{alt.expected_value ? alt.expected_value.toLocaleString() : '0'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function intPercent(prob) {
  if (prob === undefined || prob === null) return 0;
  return Math.round(prob * 100);
}
