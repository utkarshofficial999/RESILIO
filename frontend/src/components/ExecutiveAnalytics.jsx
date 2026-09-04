import React from 'react';
import { TrendingUp, IndianRupee, Clock, ShieldCheck, ArrowUpRight } from 'lucide-react';

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

  const metrics = [
    {
      label: 'Recovery Lift',
      value: summary.recovery_lift,
      sub: (
        <span className="flex items-center gap-1.5">
          <span className="font-semibold text-[#1CA672]">{summary.resilio_recovery_rate}</span>
          <span className="text-[#A0AEC0]">vs control</span>
          <span className="line-through text-[#CBD5E1]">{summary.control_recovery_rate}</span>
        </span>
      ),
      icon: TrendingUp,
      accentColor: '#2B84EA',
      bgColor: '#E8F1FD',
    },
    {
      label: 'Rescued GMV',
      value: `₹${summary.total_rescued_gmv_inr ? summary.total_rescued_gmv_inr.toLocaleString() : '4,540,000'}`,
      sub: (
        <span className="flex items-center gap-1 text-[#1CA672] font-semibold">
          <ArrowUpRight className="w-3 h-3" /> 100% Captured
        </span>
      ),
      icon: IndianRupee,
      accentColor: '#1CA672',
      bgColor: '#E6F7F0',
    },
    {
      label: 'Decision Latency',
      value: (
        <span className="font-mono">{summary.average_recovery_latency_ms}<span className="text-sm font-normal text-[#A0AEC0] ml-0.5">ms</span></span>
      ),
      sub: <span className="text-[#2B84EA] font-medium">In-flight execution • Zero lock</span>,
      icon: Clock,
      accentColor: '#6C5CE7',
      bgColor: '#F0EEFF',
    },
    {
      label: 'Frictionless Actions',
      value: <span className="font-mono">{summary.frictionless_recoveries_count}</span>,
      sub: (
        <span>
          <span className="font-medium text-[#6C5CE7]">{summary.unnecessary_retries_prevented} blind retries</span>{' '}
          <span className="text-[#A0AEC0]">intercepted</span>
        </span>
      ),
      icon: ShieldCheck,
      accentColor: '#E5A100',
      bgColor: '#FFF8E6',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, i) => {
        const Icon = m.icon;
        return (
          <div
            key={i}
            className="rzp-card p-5 relative overflow-hidden group"
          >
            {/* Left accent bar */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
              style={{ background: m.accentColor }}
            />

            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-[#A0AEC0] uppercase tracking-wider">
                {m.label}
              </span>
              <div
                className="p-2 rounded-lg"
                style={{ background: m.bgColor }}
              >
                <Icon className="w-4 h-4" style={{ color: m.accentColor }} />
              </div>
            </div>

            <div className="text-xl font-extrabold text-[#1A202C] font-heading tracking-tight">
              {m.value}
            </div>

            <div className="text-[11px] text-[#4A5568] mt-1.5">
              {m.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
}
