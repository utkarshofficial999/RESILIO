import React from 'react';
import { BarChart2, TrendingUp, X, CheckCircle, ShieldAlert, Award } from 'lucide-react';

export default function ABSimulationModal({ report, onClose }) {
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel max-w-4xl w-full rounded-2xl p-6 border border-cyan-500/40 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div>
            <span className="text-[10px] font-extrabold tracking-wider text-cyan-400 uppercase font-mono">
              SIGNATURE HACKATHON BENCHMARK
            </span>
            <h2 className="text-xl font-bold text-white flex items-center gap-2 font-heading">
              <Award className="w-6 h-6 text-amber-400" />
              1,000 Synthetic Transaction A/B Benchmark Results
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Recovery Lift Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-blue-950/60 to-purple-950/80 border border-cyan-500/50 text-center space-y-2 glow-cyan">
          <div className="text-xs font-bold text-cyan-300 font-mono tracking-widest uppercase">
            SIGNATURE METRIC ACHIEVED
          </div>
          <div className="text-4xl font-extrabold text-emerald-400 font-heading">
            +{report.recovery_lift_percentage_points}% RECOVERY LIFT
          </div>
          <p className="text-xs text-gray-300 max-w-xl mx-auto">
            Resilio recovered <span className="font-bold text-white">{report.resilio_recovered}</span> out of {report.total_transactions} failed transactions ({report.resilio_recovery_rate}%), compared to Control system's {report.control_recovered} ({report.control_recovery_rate}%).
          </p>
        </div>

        {/* Side by Side Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          {/* CONTROL BOX */}
          <div className="p-5 rounded-xl bg-gray-900/80 border border-gray-800 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-800 pb-2">
              <span className="font-bold text-rose-400 font-heading text-sm">CONTROL (TRADITIONAL)</span>
              <span className="text-[10px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded font-mono">STATIC RETRY</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Recovery Rate:</span>
                <span className="font-bold text-white font-mono">{report.control_recovery_rate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Recovered GMV:</span>
                <span className="font-bold text-gray-300 font-mono">₹{report.control_gmv_rescued.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Abandoned Carts:</span>
                <span className="font-bold text-rose-400 font-mono">{report.control_abandoned}</span>
              </div>
            </div>
          </div>

          {/* RESILIO BOX */}
          <div className="p-5 rounded-xl bg-cyan-950/30 border border-cyan-500/40 space-y-4 glow-emerald">
            <div className="flex justify-between items-center border-b border-cyan-900/60 pb-2">
              <span className="font-bold text-cyan-300 font-heading text-sm">RESILIO (AUTONOMOUS)</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-mono">CLOSED-LOOP</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-300">Recovery Rate:</span>
                <span className="font-bold text-emerald-400 font-mono text-sm">{report.resilio_recovery_rate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Rescued GMV:</span>
                <span className="font-bold text-emerald-400 font-mono">₹{report.resilio_gmv_rescued.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">GMV Uplift:</span>
                <span className="font-bold text-cyan-300 font-mono">+₹{report.gmv_lift_amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Breakdown */}
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono">
            AUTONOMOUS STRATEGY DISTRIBUTION
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {Object.entries(report.best_strategy_distribution || {}).map(([strat, val]) => (
              <div key={strat} className="p-3 rounded-lg bg-gray-900 border border-gray-800">
                <div className="text-lg font-extrabold text-cyan-300 font-mono">{val}</div>
                <div className="text-[10px] text-gray-400 font-medium">{strat}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold text-xs shadow-lg transition"
          >
            CLOSE BENCHMARK REPORT
          </button>
        </div>
      </div>
    </div>
  );
}
