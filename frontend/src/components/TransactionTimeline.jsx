import React from 'react';
import { Clock, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function TransactionTimeline({ history = [] }) {
  if (!history || history.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-6 text-center text-gray-500 border border-gray-800">
        <Clock className="w-8 h-8 mx-auto mb-2 text-gray-600" />
        <p className="text-sm font-medium">No recovery timeline records yet.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-6 border border-gray-800 flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2 font-heading">
          <Clock className="w-4 h-4 text-cyan-400" />
          Closed-Loop Recovery Event Timeline
        </h3>
        <span className="text-xs text-gray-400 font-mono">{history.length} EVENTS RECORDED</span>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        {history.map((evt, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono font-bold text-[10px]">
                #{evt.attempt_number || idx + 1}
              </div>
              <div>
                <div className="font-bold text-white font-heading">{evt.strategy}</div>
                <div className="text-gray-400 text-[11px] mt-0.5">{evt.details}</div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] px-2.5 py-0.5 rounded font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                {evt.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
