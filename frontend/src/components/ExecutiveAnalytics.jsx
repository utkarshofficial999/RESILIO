import React from 'react';
import { TrendingUp, DollarSign, Clock, ShieldCheck } from 'lucide-react';

export default function ExecutiveAnalytics({ analyticsData }) {
  const summary = analyticsData?.summary || {
    resilio_recovery_rate: '84.7%',
    control_recovery_rate: '68.2%',
    recovery_lift: '+16.5 percentage points',
    total_rescued_gmv_inr: 4540000,
    average_recovery_latency_ms: 185,
    unnecessary_retries_prevented: 318,
    frictionless_recoveries_count: 512
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {/* Metric 1: Recovery Lift */}
      <div className="glass-panel p-4 rounded-xl border border-cyan-500/30 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider font-mono">RECOVERY LIFT</span>
          <div className="text-2xl font-extrabold text-white font-heading mt-0.5">{summary.recovery_lift}</div>
          <span className="text-[11px] text-gray-400">Resilio ({summary.resilio_recovery_rate}) vs Control ({summary.control_recovery_rate})</span>
        </div>
        <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
          <TrendingUp className="w-5 h-5" />
        </div>
      </div>

      {/* Metric 2: Rescued GMV */}
      <div className="glass-panel p-4 rounded-xl border border-emerald-500/30 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider font-mono">RESCUED GMV</span>
          <div className="text-2xl font-extrabold text-emerald-300 font-heading mt-0.5">
            ₹{summary.total_rescued_gmv_inr ? summary.total_rescued_gmv_inr.toLocaleString() : '4,540,000'}
          </div>
          <span className="text-[11px] text-gray-400">Direct revenue captured</span>
        </div>
        <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
          <DollarSign className="w-5 h-5" />
        </div>
      </div>

      {/* Metric 3: Recovery Latency */}
      <div className="glass-panel p-4 rounded-xl border border-gray-800 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">DECISION LATENCY</span>
          <div className="text-2xl font-extrabold text-white font-heading mt-0.5">{summary.average_recovery_latency_ms}ms</div>
          <span className="text-[11px] text-gray-400">Real-time rail rerouting</span>
        </div>
        <div className="p-2.5 rounded-lg bg-gray-800 text-cyan-400 border border-gray-700 shrink-0">
          <Clock className="w-5 h-5" />
        </div>
      </div>

      {/* Metric 4: Frictionless Recoveries */}
      <div className="glass-panel p-4 rounded-xl border border-purple-500/30 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider font-mono">AUTONOMOUS ACTIONS</span>
          <div className="text-2xl font-extrabold text-purple-200 font-heading mt-0.5">{summary.frictionless_recoveries_count}</div>
          <span className="text-[11px] text-gray-400">Zero user intervention required</span>
        </div>
        <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

