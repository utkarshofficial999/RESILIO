import React from 'react';
import { TrendingUp, DollarSign, Clock, ShieldCheck, Zap, BarChart2 } from 'lucide-react';

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
    <div className="glass-panel rounded-2xl p-6 border border-gray-800 flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <span className="text-[10px] font-extrabold tracking-wider text-cyan-400 uppercase font-mono">
            MERCHANT VALUE & FINTECH METRICS
          </span>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 font-heading">
            <BarChart2 className="w-5 h-5 text-cyan-400" />
            Executive Recovery Lift & GMV Performance
          </h2>
        </div>
        <div className="px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold">
          RECOVERY LIFT: {summary.recovery_lift}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Recovery Lift */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/50 to-blue-950/40 border border-cyan-500/40 shadow-xl">
          <div className="flex items-center justify-between text-cyan-400 mb-2">
            <span className="text-xs font-bold font-mono">RECOVERY LIFT</span>
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-white font-heading">{summary.recovery_lift}</div>
          <div className="text-xs text-gray-400 mt-1">
            Resilio ({summary.resilio_recovery_rate}) vs Control ({summary.control_recovery_rate})
          </div>
        </div>

        {/* Metric 2: Rescued GMV */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/50 to-emerald-900/30 border border-emerald-500/40 shadow-xl">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-bold font-mono">RESCUED GMV</span>
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-300 font-heading">
            ₹{summary.total_rescued_gmv_inr ? (summary.total_rescued_gmv_inr).toLocaleString() : '4,540,000'}
          </div>
          <div className="text-xs text-gray-400 mt-1">Direct merchant revenue recovered</div>
        </div>

        {/* Metric 3: Recovery Time Latency */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 shadow-xl">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-bold font-mono">AVG RECOVERY TIME</span>
            <Clock className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-heading">
            {summary.average_recovery_latency_ms}ms
          </div>
          <div className="text-xs text-gray-400 mt-1">In-flight decision & rail reroute</div>
        </div>

        {/* Metric 4: Frictionless Recoveries */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950/50 to-indigo-950/40 border border-purple-500/40 shadow-xl">
          <div className="flex items-center justify-between text-purple-400 mb-2">
            <span className="text-xs font-bold font-mono">FRICTIONLESS RECOVERIES</span>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-3xl font-extrabold text-purple-200 font-heading">
            {summary.frictionless_recoveries_count}
          </div>
          <div className="text-xs text-gray-400 mt-1">Zero user intervention required</div>
        </div>
      </div>
    </div>
  );
}
