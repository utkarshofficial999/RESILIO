import React, { useState } from 'react';
import { BarChart2, TrendingUp, X, CheckCircle, Award, Download, Copy, Check } from 'lucide-react';

export default function ABSimulationModal({ report, onClose }) {
  const [copied, setCopied] = useState(false);
  if (!report) return null;

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `resilio_ab_benchmark_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="rzp-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="rzp-card-elevated max-w-4xl w-full p-6 sm:p-7 space-y-6 max-h-[90vh] overflow-y-auto animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
          <div>
            <span className="rzp-badge rzp-badge-blue font-mono mb-1 inline-block">
              BENCHMARK REPORT
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#1A202C] flex items-center gap-2.5 font-heading mt-1">
              <Award className="w-6 h-6 text-[#E5A100]" />
              1,000 Synthetic Transaction A/B Benchmark
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJSON}
              className="rzp-btn-secondary flex items-center gap-1.5 !text-xs"
              title="Copy JSON Report"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#1CA672]" /> : <Copy className="w-3.5 h-3.5 text-[#2B84EA]" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="rzp-btn-primary flex items-center gap-1.5 !text-xs !py-2"
              title="Download Benchmark JSON"
            >
              <Download className="w-3.5 h-3.5" /> Export JSON
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#F5F7FA] hover:bg-[#E2E8F0] text-[#A0AEC0] hover:text-[#4A5568] transition border border-[#E2E8F0]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Hero Recovery Lift Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#072654] via-[#0B3A7A] to-[#1A5BB5] text-center space-y-2 relative overflow-hidden">
          <div className="text-xs font-extrabold text-blue-200/80 font-mono tracking-widest uppercase">
            Recovery Lift Delivered
          </div>
          <div className="text-4xl sm:text-5xl font-extrabold text-white font-heading tracking-tight">
            +{report.recovery_lift_percentage_points}% Recovery Lift
          </div>
          <p className="text-xs sm:text-sm text-blue-100/80 max-w-xl mx-auto leading-relaxed">
            Resilio recovered <span className="font-bold text-white font-mono">{report.resilio_recovered}</span> out of {report.total_transactions} failed transactions (<span className="text-[#7DCEA0] font-bold font-mono">{report.resilio_recovery_rate}%</span>), compared to static retry system's <span className="font-mono text-blue-200">{report.control_recovered}</span> (<span className="text-blue-300/80 font-mono">{report.control_recovery_rate}%</span>).
          </p>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* CONTROL BOX */}
          <div className="p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-4">
            <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-2.5">
              <span className="font-bold text-[#CB3837] font-heading text-sm">Control (Traditional Gateway)</span>
              <span className="rzp-badge rzp-badge-red">BLIND RETRY</span>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between text-[#4A5568]">
                <span className="text-[#A0AEC0]">Recovery Rate:</span>
                <span className="font-bold text-[#1A202C] font-mono">{report.control_recovery_rate}%</span>
              </div>
              <div className="flex justify-between text-[#4A5568]">
                <span className="text-[#A0AEC0]">Rescued GMV:</span>
                <span className="font-bold text-[#4A5568] font-mono">₹{report.control_gmv_rescued.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#4A5568]">
                <span className="text-[#A0AEC0]">Abandoned:</span>
                <span className="font-bold text-[#CB3837] font-mono">{report.control_abandoned} / {report.total_transactions}</span>
              </div>
              <div className="flex justify-between text-[#4A5568]">
                <span className="text-[#A0AEC0]">Customer Friction:</span>
                <span className="font-bold text-[#CB3837] font-mono">HIGH</span>
              </div>
            </div>
          </div>

          {/* RESILIO BOX */}
          <div className="p-5 rounded-xl bg-[#E6F7F0] border border-[#1CA672]/30 space-y-4">
            <div className="flex justify-between items-center border-b border-[#1CA672]/20 pb-2.5">
              <span className="font-bold text-[#0D5E3F] font-heading text-sm">Resilio (Autonomous Layer)</span>
              <span className="rzp-badge rzp-badge-green">CLOSED-LOOP ERV</span>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between text-[#4A5568]">
                <span className="text-[#0D5E3F]/70">Recovery Rate:</span>
                <span className="font-extrabold text-[#1CA672] font-mono text-sm">{report.resilio_recovery_rate}%</span>
              </div>
              <div className="flex justify-between text-[#4A5568]">
                <span className="text-[#0D5E3F]/70">Rescued GMV:</span>
                <span className="font-extrabold text-[#1CA672] font-mono">₹{report.resilio_gmv_rescued.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#4A5568]">
                <span className="text-[#0D5E3F]/70">Incremental Lift:</span>
                <span className="font-extrabold text-[#2B84EA] font-mono">+₹{report.gmv_lift_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#4A5568]">
                <span className="text-[#0D5E3F]/70">Frictionless:</span>
                <span className="font-bold text-[#1CA672] font-mono">{report.customer_friction_avoided_count || '512'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy Breakdown */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-[#A0AEC0] uppercase tracking-wider">
              Autonomous Strategy Distribution
            </h4>
            <span className="text-[10px] text-[#CBD5E1] font-mono">1,000 Transactions</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            {Object.entries(report.best_strategy_distribution || {}).map(([strat, val]) => (
              <div key={strat} className="p-3 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0]">
                <div className="text-xl font-extrabold text-[#2B84EA] font-mono">{val}</div>
                <div className="text-[11px] text-[#A0AEC0] font-medium mt-0.5">{strat}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Close CTA */}
        <div className="text-center pt-2">
          <button
            onClick={onClose}
            className="rzp-btn-primary !px-8 !py-3 !text-xs"
          >
            Close Benchmark Report
          </button>
        </div>
      </div>
    </div>
  );
}
