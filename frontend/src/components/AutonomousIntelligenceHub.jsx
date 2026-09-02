import React, { useState, useEffect } from 'react';
import { TrendingUp, Cpu, Radio, CheckCircle, HelpCircle, Eye, RefreshCw, Zap, Shield, Search, Activity, Lightbulb, Target, CheckCircle2, BookOpen } from 'lucide-react';

const AGENT_NODES = [
  { id: 'investigator', name: 'Agent 1: Failure Investigator', icon: Search, role: 'Taxonomy & Risk Diagnosis' },
  { id: 'observer', name: 'Agent 2: Telemetry Observer', icon: Activity, role: 'Live Bank & Gateway Meter' },
  { id: 'strategist', name: 'Agent 3: Recovery Strategist', icon: Lightbulb, role: 'Candidate Strategy Generator' },
  { id: 'optimizer', name: 'Agent 4: Recovery Optimizer', icon: Target, role: 'ERV Scoring & Policy Engine' },
  { id: 'executor', name: 'Agent 5: Recovery Executor', icon: Cpu, role: 'Rail Shift / UI Tool Execution' },
  { id: 'verifier', name: 'Agent 6: Recovery Verifier', icon: CheckCircle2, role: 'Outcome Verification' },
  { id: 'learner', name: 'Agent 7: Learning Analyzer', icon: BookOpen, role: 'Closed-Loop Memory Update' },
];

export default function AutonomousIntelligenceHub({
  latestResult,
  telemetry,
  isProcessing
}) {
  const [activeTab, setActiveTab] = useState('REASONING'); // 'REASONING', 'PIPELINE', 'TELEMETRY'
  const [selectedNodeTrace, setSelectedNodeTrace] = useState(null);

  // Auto-switch to Reasoning tab when a new result arrives
  useEffect(() => {
    if (latestResult?.counterfactual_explanation) {
      setActiveTab('REASONING');
    }
  }, [latestResult]);

  const counterfactual = latestResult?.counterfactual_explanation;
  const nodeTraces = latestResult?.node_traces || [];

  const getTraceForNode = (agentIdKey) => {
    return nodeTraces.find((t) => t.agent_id && t.agent_id.includes(agentIdKey));
  };

  const banks = telemetry?.banks || {
    HDFC: { success_rate: 0.94, latency_ms: 120, error_rate: 0.06, status: 'HEALTHY' },
    ICICI: { success_rate: 0.95, latency_ms: 95, error_rate: 0.05, status: 'HEALTHY' },
    SBI: { success_rate: 0.78, latency_ms: 320, error_rate: 0.22, status: 'DEGRADED' },
    AXIS: { success_rate: 0.91, latency_ms: 110, error_rate: 0.09, status: 'HEALTHY' },
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-gray-800 flex flex-col gap-5 h-full">
      {/* Tab Navigation Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3 flex-wrap gap-2">
        <div className="flex p-1 bg-gray-950 rounded-xl border border-gray-800/80 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('REASONING')}
            className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'REASONING'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Decision Reasoning
            {counterfactual && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1" />}
          </button>
          <button
            onClick={() => setActiveTab('PIPELINE')}
            className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'PIPELINE'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            7-Node Agent Graph
            {nodeTraces.length > 0 && (
              <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded font-mono ml-0.5">
                {nodeTraces.length}/7
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('TELEMETRY')}
            className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
              activeTab === 'TELEMETRY'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            Bank Telemetry
          </button>
        </div>

        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
          AUTONOMOUS INTELLIGENCE HUB
        </span>
      </div>

      {/* TAB 1: DECISION REASONING & COUNTERFACTUAL MATRIX */}
      {activeTab === 'REASONING' && (
        <div className="flex flex-col gap-4 flex-1">
          {counterfactual ? (
            <>
              {/* ERV Header */}
              <div className="flex items-center justify-between bg-gray-900/60 p-3 rounded-xl border border-gray-800">
                <div>
                  <span className="text-[10px] font-mono text-gray-400 font-bold uppercase">SELECTED RECOVERY ACTION</span>
                  <div className="text-sm font-bold text-white font-heading flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    {counterfactual.selected_strategy}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-gray-400 font-bold uppercase">EXPECTED RECOVERY VALUE</span>
                  <div className="text-lg font-extrabold text-emerald-400 font-heading">
                    ₹{counterfactual.selected_expected_value?.toLocaleString() || '0'}
                  </div>
                </div>
              </div>

              {/* Reasoning Explanation */}
              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-gray-300 leading-relaxed font-sans">
                <span className="font-bold text-cyan-300 font-mono block mb-1">WHY THIS ACTION WON:</span>
                {counterfactual.why_this_action}
              </div>

              {/* Evaluated Alternatives Matrix */}
              <div className="flex-1 flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 font-mono">
                  COUNTERFACTUAL MATRIX (EVALUATED ALTERNATIVES)
                </span>
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {(counterfactual.alternatives || []).map((alt, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-gray-900/60 border border-gray-800/80 flex items-center justify-between text-xs hover:border-gray-700 transition"
                    >
                      <div className="flex-1 pr-2">
                        <div className="flex items-center gap-1.5 font-bold text-gray-200 text-[11px]">
                          <span>{alt.strategy}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-gray-800 text-gray-400 font-mono">
                            FRICTION: {alt.friction}
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{alt.reasoning}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[10px] text-gray-400 font-mono">
                          P: {Math.round((alt.expected_recovery_prob || 0) * 100)}%
                        </div>
                        <div className="font-bold text-amber-400 font-mono text-xs">
                          ₹{alt.expected_value?.toLocaleString() || '0'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center gap-3 my-auto">
              <div className="p-3 rounded-2xl bg-gray-900 border border-gray-800 text-gray-600">
                <HelpCircle className="w-8 h-8 text-cyan-500/50" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-300 font-heading">Decision Engine Ready</p>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">
                  Run a simulated failure on the left to see autonomous ERV scoring and auditable counterfactual ranking.
                </p>
              </div>
              <div className="text-[11px] font-mono text-cyan-400/70 p-2 rounded bg-cyan-950/30 border border-cyan-900/40">
                ERV = (Value × P) - Cost - Friction - Risk
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: 7-NODE LANGGRAPH MULTI-AGENT STATE MACHINE */}
      {activeTab === 'PIPELINE' && (
        <div className="space-y-3 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {AGENT_NODES.map((node, index) => {
              const Icon = node.icon;
              const trace = getTraceForNode(node.id);
              const isCompleted = !!trace;
              const isActive = isProcessing && index === 3;

              return (
                <div
                  key={node.id}
                  onClick={() => trace && setSelectedNodeTrace(trace)}
                  className={`p-3 rounded-xl border transition flex flex-col justify-between cursor-pointer ${
                    isCompleted
                      ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300 hover:border-cyan-400'
                      : isActive
                      ? 'bg-amber-950/30 border-amber-500 text-amber-300 animate-pulse'
                      : 'bg-gray-900/50 border-gray-800 text-gray-500 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg ${isCompleted ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-800 text-gray-400'}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-white font-heading">{node.name}</span>
                    </div>
                    {isCompleted && <Eye className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                  <p className="text-[10px] text-gray-400 line-clamp-1">{node.role}</p>
                  <div className="mt-2 pt-1.5 border-t border-gray-800/80 flex justify-between text-[9px] font-mono">
                    <span className={isCompleted ? 'text-emerald-400 font-bold' : 'text-gray-500'}>
                      {isCompleted ? 'STATE: COMPLETED' : 'STATE: IDLE'}
                    </span>
                    <span className="text-gray-400">{trace?.timestamp || '--:--:--'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: LIVE BANK TELEMETRY */}
      {activeTab === 'TELEMETRY' && (
        <div className="grid grid-cols-2 gap-3 flex-1">
          {Object.entries(banks).map(([bankName, info]) => {
            const isOutage = info.status === 'OUTAGE' || info.success_rate < 0.50;
            const isDegraded = info.status === 'DEGRADED';
            const srPercent = Math.round(info.success_rate * 100);

            return (
              <div
                key={bankName}
                className={`p-3.5 rounded-xl border flex flex-col justify-between transition ${
                  isOutage
                    ? 'bg-rose-950/40 border-rose-500/60 shadow-lg shadow-rose-950/50 animate-pulse'
                    : isDegraded
                    ? 'bg-amber-950/30 border-amber-500/40'
                    : 'bg-gray-900/60 border-gray-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white font-heading">{bankName} BANK</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
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

                <div className="my-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400 text-[11px]">Success Rate</span>
                    <span className={`font-bold font-mono ${isOutage ? 'text-rose-400' : isDegraded ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {srPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isOutage ? 'bg-rose-500' : isDegraded ? 'bg-amber-400' : 'bg-emerald-400'
                      }`}
                      style={{ width: `${srPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                  <span>LATENCY: {info.latency_ms}ms</span>
                  <span>ERR: {Math.round((info.error_rate || 0.05) * 100)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Node Trace Payload Inspector Modal */}
      {selectedNodeTrace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel max-w-xl w-full rounded-2xl p-5 border border-gray-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 font-heading">
                <Eye className="w-4 h-4 text-cyan-400" />
                Payload Inspector: {selectedNodeTrace.node_name}
              </h3>
              <button
                onClick={() => setSelectedNodeTrace(null)}
                className="text-gray-400 hover:text-white text-xs font-semibold px-2 py-1 bg-gray-800 rounded"
              >
                ✕ CLOSE
              </button>
            </div>

            <div className="space-y-3 max-h-[55vh] overflow-y-auto font-mono text-[11px]">
              <div>
                <span className="text-gray-400 font-sans block mb-1 font-semibold text-xs">INPUT PAYLOAD:</span>
                <pre className="p-2.5 rounded-lg bg-gray-950 text-cyan-300 border border-gray-800 overflow-x-auto">
                  {JSON.stringify(selectedNodeTrace.input_payload, null, 2)}
                </pre>
              </div>

              <div>
                <span className="text-gray-400 font-sans block mb-1 font-semibold text-xs">OUTPUT PAYLOAD:</span>
                <pre className="p-2.5 rounded-lg bg-gray-950 text-emerald-300 border border-gray-800 overflow-x-auto">
                  {JSON.stringify(selectedNodeTrace.output_payload, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
