import React, { useState, useEffect } from 'react';
import { TrendingUp, Cpu, Radio, CheckCircle, HelpCircle, Eye, RefreshCw, Zap, Shield, Search, Activity, Lightbulb, Target, CheckCircle2, BookOpen, ArrowRight, Layers } from 'lucide-react';

const AGENT_NODES = [
  { id: 'investigator', name: 'Failure Investigator', nodeNum: '01', icon: Search, role: 'Taxonomy & Risk Diagnosis', desc: 'Classifies failure into INFRASTRUCTURE vs USER_INTENT' },
  { id: 'observer', name: 'Telemetry Observer', nodeNum: '02', icon: Activity, role: 'Live Bank & Gateway Meter', desc: 'Monitors real-time rail success rates and outages' },
  { id: 'strategist', name: 'Recovery Strategist', nodeNum: '03', icon: Lightbulb, role: 'Candidate Strategy Generator', desc: 'Synthesizes Reroute, UI Flip, Retry, or Async candidates' },
  { id: 'optimizer', name: 'Recovery Optimizer', nodeNum: '04', icon: Target, role: 'ERV Scoring & Policy Engine', desc: 'Calculates Expected Recovery Value and selects optimal path' },
  { id: 'executor', name: 'Recovery Executor', nodeNum: '05', icon: Cpu, role: 'Rail Shift / UI Tool Execution', desc: 'Executes invisible rail swap or UI intent switch' },
  { id: 'verifier', name: 'Recovery Verifier', nodeNum: '06', icon: CheckCircle2, role: 'Outcome Verification', desc: 'Confirms captured settlement & receipt states' },
  { id: 'learner', name: 'Learning Analyzer', nodeNum: '07', icon: BookOpen, role: 'Closed-Loop Memory Update', desc: 'Updates persistent infra & merchant weights' },
];

export default function AutonomousIntelligenceHub({
  latestResult,
  telemetry,
  isProcessing
}) {
  const [activeTab, setActiveTab] = useState('REASONING');
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

  const tabs = [
    { id: 'REASONING', label: 'Decision Reasoning', icon: TrendingUp, hasNotif: !!counterfactual },
    { id: 'PIPELINE', label: '7-Node Agent Flow', icon: Layers, count: nodeTraces.length > 0 ? `${nodeTraces.length}/7` : null },
    { id: 'TELEMETRY', label: 'Live Telemetry', icon: Radio },
  ];

  return (
    <div className="rzp-card-elevated p-6 flex flex-col gap-5 h-full">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 flex-wrap gap-2.5">
        <div className="flex p-1 bg-[#F5F7FA] rounded-lg border border-[#E2E8F0] text-xs font-semibold">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-[#2B84EA] text-white shadow-sm'
                    : 'text-[#4A5568] hover:text-[#1A202C]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.hasNotif && <span className="w-1.5 h-1.5 rounded-full bg-[#1CA672] ml-0.5" />}
                {tab.count && (
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono ml-0.5">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <span className="rzp-badge rzp-badge-navy font-mono">
          INTELLIGENCE HUB
        </span>
      </div>

      {/* TAB 1: DECISION REASONING */}
      {activeTab === 'REASONING' && (
        <div className="flex flex-col gap-4 flex-1 animate-fadeIn">
          {counterfactual ? (
            <>
              {/* ERV Header Box */}
              <div className="flex items-center justify-between bg-[#F5F7FA] p-4 rounded-xl border border-[#E2E8F0]">
                <div>
                  <span className="text-[10px] font-mono text-[#2B84EA] font-bold uppercase tracking-wider">
                    Winning Recovery Strategy
                  </span>
                  <div className="text-base font-extrabold text-[#1A202C] font-heading flex items-center gap-2 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-[#1CA672]" />
                    <span>{counterfactual.selected_strategy}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#A0AEC0] font-bold uppercase tracking-wider">
                    Expected Recovery Value (ERV)
                  </span>
                  <div className="text-xl font-extrabold text-[#1CA672] font-heading font-mono mt-0.5">
                    ₹{counterfactual.selected_expected_value ? Number(counterfactual.selected_expected_value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                  </div>
                </div>
              </div>

              {/* Rationale */}
              <div className="p-4 rounded-xl bg-[#E8F1FD] border border-[#2B84EA]/20 text-xs text-[#4A5568] leading-relaxed">
                <span className="font-bold text-[#072654] block mb-1 tracking-wide text-[11px]">
                  WHY THIS ACTION WON:
                </span>
                {counterfactual.why_this_action}
              </div>

              {/* Evaluated Alternatives Matrix */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-[#A0AEC0] uppercase tracking-wider">
                    Counterfactual Matrix (Evaluated Alternatives)
                  </span>
                  <span className="text-[10px] text-[#CBD5E1] font-mono">ERV Breakdown</span>
                </div>
                
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {(counterfactual.alternatives || []).map((alt, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs hover:border-[#CBD5E1] transition-all"
                    >
                      <div className="flex-1 pr-3">
                        <div className="flex items-center gap-2 font-bold text-[#1A202C] text-xs">
                          <span>{alt.strategy}</span>
                          <span className={`rzp-badge text-[9px] ${
                            alt.friction === 'NONE' || alt.friction === 'LOW' 
                              ? 'rzp-badge-green' : 'rzp-badge-amber'
                          }`}>
                            FRICTION: {alt.friction}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#A0AEC0] mt-1 line-clamp-1">{alt.reasoning}</div>
                      </div>
                      
                      <div className="text-right shrink-0">
                        <div className="text-[10px] text-[#A0AEC0] font-mono">
                          P(Success): {Math.round((alt.expected_recovery_prob || 0) * 100)}%
                        </div>
                        <div className="font-extrabold text-[#E5A100] font-mono text-xs mt-0.5">
                          ₹{alt.expected_value ? Number(alt.expected_value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 text-center flex flex-col items-center justify-center gap-3.5 my-auto">
              <div className="p-4 rounded-xl bg-[#F5F7FA] border border-[#E2E8F0] text-[#2B84EA]">
                <HelpCircle className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#1A202C] font-heading">Decision Reasoning Engine Ready</p>
                <p className="text-xs text-[#A0AEC0] mt-1 max-w-xs leading-relaxed">
                  Trigger a simulated payment failure in the checkout sandbox to view live ERV calculations and counterfactual ranking.
                </p>
              </div>
              <div className="text-[11px] font-mono text-[#2B84EA] p-3 rounded-lg bg-[#E8F1FD] border border-[#2B84EA]/20">
                ERV = (Txn Value × P_recovery) - Recovery Cost - Friction Penalty - Risk
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: 7-NODE AGENT PIPELINE */}
      {activeTab === 'PIPELINE' && (
        <div className="space-y-3 flex-1 animate-fadeIn">
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
                  className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between cursor-pointer active:scale-[0.98] ${
                    isCompleted
                      ? 'bg-[#E6F7F0] border-[#1CA672]/40 hover:border-[#1CA672]'
                      : isActive
                      ? 'bg-[#FFF8E6] border-[#E5A100]/50 animate-pulse'
                      : 'bg-white border-[#E2E8F0] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${isCompleted ? 'bg-[#1CA672]/15 text-[#1CA672]' : 'bg-[#F5F7FA] text-[#A0AEC0]'}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-[#2B84EA] font-mono font-bold block">NODE {node.nodeNum}</span>
                        <span className="text-xs font-bold text-[#1A202C] font-heading">{node.name}</span>
                      </div>
                    </div>
                    {isCompleted && (
                      <span className="rzp-badge rzp-badge-blue text-[10px] flex items-center gap-1">
                        <Eye className="w-3 h-3" /> View
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#A0AEC0] mt-1 leading-snug">{node.desc}</p>
                  
                  <div className="mt-2.5 pt-2 border-t border-[#E2E8F0] flex justify-between text-[10px] font-mono">
                    <span className={isCompleted ? 'text-[#1CA672] font-bold' : 'text-[#CBD5E1]'}>
                      {isCompleted ? '✓ COMPLETED' : 'IDLE'}
                    </span>
                    <span className="text-[#CBD5E1]">{trace?.timestamp || '--:--:--'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: LIVE BANK TELEMETRY */}
      {activeTab === 'TELEMETRY' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 animate-fadeIn">
          {Object.entries(banks).map(([bankName, info]) => {
            const isOutage = info.status === 'OUTAGE' || info.success_rate < 0.50;
            const isDegraded = info.status === 'DEGRADED';
            const srPercent = Math.round(info.success_rate * 100);

            return (
              <div
                key={bankName}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  isOutage
                    ? 'bg-[#FDEAEA] border-[#CB3837]/40'
                    : isDegraded
                    ? 'bg-[#FFF8E6] border-[#E5A100]/40'
                    : 'bg-white border-[#E2E8F0]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#1A202C] font-heading tracking-wide">{bankName} Bank Rail</span>
                  <span className={`rzp-badge ${
                    isOutage ? 'rzp-badge-red' : isDegraded ? 'rzp-badge-amber' : 'rzp-badge-green'
                  }`}>
                    {isOutage ? 'OUTAGE (42%)' : info.status}
                  </span>
                </div>

                <div className="my-3">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#A0AEC0] text-[11px] font-mono">Success Rate</span>
                    <span className={`font-bold font-mono text-sm ${
                      isOutage ? 'text-[#CB3837]' : isDegraded ? 'text-[#B8860B]' : 'text-[#1CA672]'
                    }`}>
                      {srPercent}%
                    </span>
                  </div>
                  <div className="rzp-progress-track">
                    <div
                      className={`rzp-progress-fill ${
                        isOutage ? 'bg-[#CB3837]' : isDegraded ? 'bg-[#E5A100]' : 'bg-[#1CA672]'
                      }`}
                      style={{ width: `${srPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-[#A0AEC0] font-mono pt-2 border-t border-[#E2E8F0]">
                  <span>LATENCY: {info.latency_ms}ms</span>
                  <span>FAILOVER: {isOutage ? 'ACTIVE ➔ ICICI' : 'STANDBY'}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Node Trace Payload Inspector Modal */}
      {selectedNodeTrace && (
        <div className="rzp-modal-overlay" onClick={(e) => e.target === e.currentTarget && setSelectedNodeTrace(null)}>
          <div className="rzp-card-elevated max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="text-sm font-bold text-[#1A202C] flex items-center gap-2 font-heading">
                <Eye className="w-4 h-4 text-[#2B84EA]" />
                Payload Inspector: {selectedNodeTrace.node_name}
              </h3>
              <button
                onClick={() => setSelectedNodeTrace(null)}
                className="rzp-btn-secondary !text-xs !px-3 !py-1"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-3 max-h-[55vh] overflow-y-auto font-mono text-[11px]">
              <div>
                <span className="text-[#A0AEC0] font-sans block mb-1 font-semibold text-xs">INPUT PAYLOAD:</span>
                <pre className="p-3 rounded-lg bg-[#F5F7FA] text-[#2B84EA] border border-[#E2E8F0] overflow-x-auto text-[11px]">
                  {JSON.stringify(selectedNodeTrace.input_payload, null, 2)}
                </pre>
              </div>

              <div>
                <span className="text-[#A0AEC0] font-sans block mb-1 font-semibold text-xs">OUTPUT PAYLOAD:</span>
                <pre className="p-3 rounded-lg bg-[#E6F7F0] text-[#0D5E3F] border border-[#1CA672]/20 overflow-x-auto text-[11px]">
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
