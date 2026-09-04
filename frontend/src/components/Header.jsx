import React from 'react';
import { AlertTriangle, RefreshCw, BarChart2, Search, Bell, HelpCircle } from 'lucide-react';

export default function Header({ onInjectOutage, onResetTelemetry, onRunDemo, isOutageActive }) {
  return (
    <header className="rzp-topbar">
      <div className="flex items-center gap-6">
        {/* Page Title */}
        <div>
          <h1 className="text-lg font-bold text-[#1A202C] font-heading leading-tight">
            Payment Recovery Dashboard
          </h1>
          <p className="text-xs text-[#A0AEC0] font-medium">
            Autonomous multi-agent recovery intelligence
          </p>
        </div>
      </div>

      {/* Right Action Center */}
      <div className="flex items-center gap-3">
        {/* Outage Injector */}
        <button
          onClick={onInjectOutage}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all active:scale-[0.97] ${
            isOutageActive
              ? 'bg-[#FDEAEA] text-[#CB3837] border border-[#F5C6C6]'
              : 'bg-[#FFF8E6] hover:bg-[#FFF0CC] text-[#92600A] border border-[#F0E0A0]'
          }`}
        >
          <AlertTriangle className={`w-3.5 h-3.5 ${isOutageActive ? 'animate-pulse text-[#CB3837]' : 'text-[#E5A100]'}`} />
          <span>{isOutageActive ? 'OUTAGE ACTIVE (HDFC)' : 'Inject Bank Outage'}</span>
        </button>

        {isOutageActive && (
          <button
            onClick={onResetTelemetry}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#4A5568] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] transition active:scale-[0.97]"
            title="Reset Bank Telemetry"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#2B84EA]" />
            <span>Reset</span>
          </button>
        )}

        {/* 1-Click Benchmark */}
        <button
          onClick={onRunDemo}
          className="rzp-btn-primary flex items-center gap-2 !py-2 !px-4 !text-xs"
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Run 1,000 TX Benchmark</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 font-mono font-extrabold ml-0.5">
            +16.5%
          </span>
        </button>

        {/* Utility Icons */}
        <div className="hidden lg:flex items-center gap-1 ml-1 border-l border-[#E2E8F0] pl-3">
          <button className="p-2 rounded-lg hover:bg-[#F5F7FA] text-[#A0AEC0] hover:text-[#4A5568] transition" title="Search">
            <Search className="w-4.5 h-4.5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-[#F5F7FA] text-[#A0AEC0] hover:text-[#4A5568] transition relative" title="Notifications">
            <Bell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#CB3837] rounded-full" />
          </button>
          <button className="p-2 rounded-lg hover:bg-[#F5F7FA] text-[#A0AEC0] hover:text-[#4A5568] transition" title="Help">
            <HelpCircle className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
