import React from 'react';
import { ShieldCheck, Zap, AlertTriangle, RefreshCw, BarChart2 } from 'lucide-react';

export default function Header({ onInjectOutage, onResetTelemetry, onRunDemo, isOutageActive }) {
  return (
    <header className="glass-panel sticky top-0 z-50 px-6 py-4 border-b border-gray-800 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-white font-heading">
              RESILIO
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800">
              v1.0.0 HACKATHON EDITION
            </span>
          </div>
          <p className="text-xs text-gray-400 font-medium">
            Autonomous Payment Recovery Intelligence Layer • <span className="italic">Every failed payment deserves another path</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Outage Injector Button */}
        <button
          onClick={onInjectOutage}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all shadow-md ${
            isOutageActive
              ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
              : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          {isOutageActive ? 'OUTAGE INJECTED (HDFC 42%)' : 'INJECT BANK OUTAGE'}
        </button>

        {isOutageActive && (
          <button
            onClick={onResetTelemetry}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium border border-gray-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}

        {/* 1-Click Signature Demo Run */}
        <button
          onClick={onRunDemo}
          className="flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
        >
          <BarChart2 className="w-4 h-4" />
          RUN 1,000 TX BENCHMARK
        </button>
      </div>
    </header>
  );
}
