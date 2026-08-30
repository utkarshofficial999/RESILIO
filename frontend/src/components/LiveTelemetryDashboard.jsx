import React from 'react';
import { Activity, ShieldCheck, AlertTriangle, Radio } from 'lucide-react';

export default function LiveTelemetryDashboard({ telemetry }) {
  const banks = telemetry?.banks || {
    HDFC: { success_rate: 0.94, latency_ms: 120, error_rate: 0.06, status: 'HEALTHY' },
    ICICI: { success_rate: 0.95, latency_ms: 95, error_rate: 0.05, status: 'HEALTHY' },
    SBI: { success_rate: 0.78, latency_ms: 320, error_rate: 0.22, status: 'DEGRADED' },
    AXIS: { success_rate: 0.91, latency_ms: 110, error_rate: 0.09, status: 'HEALTHY' },
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-gray-800 flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-gray-800 pb-4">
        <div>
          <span className="text-[10px] font-extrabold tracking-wider text-cyan-400 uppercase font-mono">
            RAZORPAY NETWORK INTELLIGENCE
          </span>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            Live Infrastructure & Bank Health Telemetry
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> REAL-TIME AGENT TELEMETRY
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(banks).map(([bankName, info]) => {
          const isOutage = info.status === 'OUTAGE' || info.success_rate < 0.50;
          const isDegraded = info.status === 'DEGRADED';
          const srPercent = Math.round(info.success_rate * 100);

          return (
            <div
              key={bankName}
              className={`p-4 rounded-xl border transition-all ${
                isOutage
                  ? 'bg-rose-950/40 border-rose-500/60 shadow-lg shadow-rose-950/50 animate-pulse'
                  : isDegraded
                  ? 'bg-amber-950/30 border-amber-500/40'
                  : 'bg-gray-900/60 border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm text-white font-heading">{bankName} BANK</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                    isOutage
                      ? 'bg-rose-900 text-rose-300 border border-rose-700'
                      : isDegraded
                      ? 'bg-amber-900 text-amber-300 border border-amber-700'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}
                >
                  {info.status}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-gray-400">Success Rate</span>
                  <span
                    className={`text-lg font-extrabold font-mono ${
                      isOutage ? 'text-rose-400' : isDegraded ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {srPercent}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isOutage ? 'bg-rose-500' : isDegraded ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${srPercent}%` }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-gray-500 font-mono pt-1">
                  <span>LATENCY: {info.latency_ms}ms</span>
                  <span>ERR: {Math.round((info.error_rate || 0.05) * 100)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
