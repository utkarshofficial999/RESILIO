import React from 'react';
import { Clock, CheckCircle2, AlertCircle, ArrowRight, Trash2, Zap, Smartphone, RefreshCw, Shield } from 'lucide-react';

export default function TransactionTimeline({ history = [], onClearHistory }) {
  if (!history || history.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-6 text-center text-gray-500 border border-gray-800">
        <Clock className="w-8 h-8 mx-auto mb-2 text-gray-600" />
        <p className="text-sm font-medium">No recovery timeline records yet.</p>
        <p className="text-xs text-gray-600">Simulate a payment above to record autonomous recovery lifecycle events.</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-emerald-950 text-emerald-400 border-emerald-800';
      case 'REQUIRES_USER':
        return 'bg-cyan-950 text-cyan-400 border-cyan-800';
      case 'PARTIAL_SUCCESS':
        return 'bg-purple-950 text-purple-400 border-purple-800';
      case 'FAILED':
      case 'ABANDONED':
        return 'bg-rose-950 text-rose-400 border-rose-800';
      default:
        return 'bg-gray-800 text-gray-300 border-gray-700';
    }
  };

  const getStrategyIcon = (strategy) => {
    if (strategy?.includes('REROUTE')) return <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />;
    if (strategy?.includes('UI_FLIP')) return <Zap className="w-3.5 h-3.5 text-amber-400" />;
    if (strategy?.includes('ASYNC')) return <Smartphone className="w-3.5 h-3.5 text-purple-400" />;
    return <Shield className="w-3.5 h-3.5 text-emerald-400" />;
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-gray-800 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2 font-heading">
          <Clock className="w-4 h-4 text-cyan-400" />
          Closed-Loop Recovery Event Timeline & Ledger
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 font-mono">{history.length} EVENTS RECORDED</span>
          {onClearHistory && history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-rose-400 font-medium px-2 py-1 bg-gray-900 rounded border border-gray-800 transition"
              title="Clear Timeline"
            >
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
        {history.map((evt, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-between gap-3 text-xs hover:border-gray-700 transition"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono font-bold text-[10px] flex items-center justify-center">
                #{evt.attempt_number || idx + 1}
              </div>
              <div>
                <div className="font-bold text-white font-heading flex items-center gap-1.5">
                  {getStrategyIcon(evt.strategy)}
                  <span>{evt.strategy}</span>
                  {evt.timestamp && (
                    <span className="text-[10px] text-gray-500 font-mono font-normal">
                      • {evt.timestamp}
                    </span>
                  )}
                </div>
                <div className="text-gray-400 text-[11px] mt-0.5">{evt.details}</div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className={`text-[10px] px-2.5 py-0.5 rounded font-mono font-bold border ${getStatusBadge(evt.status)}`}>
                {evt.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

