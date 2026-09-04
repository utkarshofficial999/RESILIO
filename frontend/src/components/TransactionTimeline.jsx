import React from 'react';
import { Clock, CheckCircle2, Trash2, Zap, Smartphone, RefreshCw, Shield } from 'lucide-react';

export default function TransactionTimeline({ history = [], onClearHistory }) {
  if (!history || history.length === 0) {
    return (
      <div className="rzp-card p-6 text-center">
        <Clock className="w-8 h-8 mx-auto mb-2 text-[#CBD5E1]" />
        <p className="text-sm font-bold text-[#1A202C] font-heading">No Recovery Audit Records Yet</p>
        <p className="text-xs text-[#A0AEC0] mt-0.5">
          Trigger a simulation in the checkout sandbox above to record autonomous recovery lifecycle events in real time.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'rzp-badge-green';
      case 'REQUIRES_USER':
        return 'rzp-badge-blue';
      case 'PARTIAL_SUCCESS':
        return 'rzp-badge-purple';
      case 'FAILED':
      case 'ABANDONED':
        return 'rzp-badge-red';
      default:
        return 'rzp-badge-navy';
    }
  };

  const getStrategyIcon = (strategy) => {
    if (strategy?.includes('REROUTE')) return <RefreshCw className="w-3.5 h-3.5 text-[#2B84EA]" />;
    if (strategy?.includes('UI_FLIP')) return <Zap className="w-3.5 h-3.5 text-[#E5A100]" />;
    if (strategy?.includes('ASYNC')) return <Smartphone className="w-3.5 h-3.5 text-[#6C5CE7]" />;
    return <Shield className="w-3.5 h-3.5 text-[#1CA672]" />;
  };

  return (
    <div className="rzp-card-elevated p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#E8F1FD] text-[#2B84EA]">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1A202C] font-heading">
              Recovery Event Ledger & Audit Trail
            </h3>
            <p className="text-[11px] text-[#A0AEC0] font-medium">
              Real-time audit log of multi-agent recovery attempts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="rzp-badge rzp-badge-blue font-mono">
            {history.length} {history.length === 1 ? 'EVENT' : 'EVENTS'}
          </span>
          {onClearHistory && history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="rzp-btn-secondary flex items-center gap-1.5 !text-xs !py-1.5"
              title="Clear Timeline"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
        {history.map((evt, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-3 text-xs hover:border-[#CBD5E1] transition-all animate-fadeIn"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#E8F1FD] text-[#2B84EA] font-mono font-bold text-[11px] flex items-center justify-center shrink-0 border border-[#2B84EA]/20">
                #{evt.attempt_number || idx + 1}
              </div>
              <div>
                <div className="font-bold text-[#1A202C] font-heading flex items-center gap-1.5">
                  {getStrategyIcon(evt.strategy)}
                  <span className="text-xs">{evt.strategy}</span>
                  {evt.timestamp && (
                    <span className="text-[10px] text-[#CBD5E1] font-mono font-normal">
                      • {evt.timestamp}
                    </span>
                  )}
                </div>
                <div className="text-[#A0AEC0] text-[11px] mt-0.5 leading-snug">{evt.details}</div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className={`rzp-badge ${getStatusBadge(evt.status)}`}>
                {evt.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
