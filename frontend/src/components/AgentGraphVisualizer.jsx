import React, { useState } from 'react';
import { Search, Activity, Lightbulb, Target, Cpu, CheckCircle2, BookOpen, ChevronRight, Eye } from 'lucide-react';

const AGENT_NODES = [
  { id: 'investigator', name: 'Agent 1: Failure Investigator', icon: Search, role: 'Error Taxonomy & Risk Diagnosis' },
  { id: 'observer', name: 'Agent 2: Telemetry Observer', icon: Activity, role: 'Live Bank & Gateway SR Meter' },
  { id: 'strategist', name: 'Agent 3: Recovery Strategist', icon: Lightbulb, role: 'Candidate Strategy Generator' },
  { id: 'optimizer', name: 'Agent 4: Recovery Optimizer', icon: Target, role: 'ERV Scoring & Policy Engine' },
  { id: 'executor', name: 'Agent 5: Recovery Executor', icon: Cpu, role: 'Tool Execution Layer' },
  { id: 'verifier', name: 'Agent 6: Recovery Verifier', icon: CheckCircle2, role: 'Outcome Verification' },
  { id: 'learner', name: 'Agent 7: Learning Analyzer', icon: BookOpen, role: 'Closed-Loop Memory Update' },
];

export default function AgentGraphVisualizer({ nodeTraces = [], activeNodeIndex = -1 }) {
  const [selectedNodeTrace, setSelectedNodeTrace] = useState(null);

  const getTraceForNode = (agentIdKey) => {
    return nodeTraces.find((t) => t.agent_id && t.agent_id.includes(agentIdKey));
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
            <Cpu className="w-5 h-5 text-cyan-400" />
            7-Node LangGraph Multi-Agent Control Plane
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Real-time visual state machine transitions across autonomous agent nodes
          </p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full font-mono bg-cyan-950/80 text-cyan-400 border border-cyan-800">
          CLOSED-LOOP WORKFLOW
        </span>
      </div>

      {/* Node Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3 relative">
        {AGENT_NODES.map((node, index) => {
          const Icon = node.icon;
          const keyName = node.id;
          const trace = getTraceForNode(keyName);
          const isCompleted = !!trace;
          const isActive = index === activeNodeIndex;

          return (
            <div key={node.id} className="relative group">
              <div
                onClick={() => trace && setSelectedNodeTrace(trace)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col items-start gap-2 h-full ${
                  isCompleted
                    ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-950/40 hover:border-cyan-400'
                    : isActive
                    ? 'bg-amber-950/30 border-amber-500 text-amber-300 animate-pulse'
                    : 'bg-gray-900/60 border-gray-800 text-gray-500 hover:border-gray-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className={`p-2 rounded-lg ${
                      isCompleted ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {isCompleted && <Eye className="w-3.5 h-3.5 text-cyan-400 opacity-60 group-hover:opacity-100" />}
                </div>

                <div>
                  <div className="text-xs font-bold font-heading text-white line-clamp-1">{node.name}</div>
                  <div className="text-[10px] text-gray-400 leading-tight mt-0.5 line-clamp-2">{node.role}</div>
                </div>

                {isCompleted && (
                  <div className="mt-auto pt-2 w-full flex justify-between items-center text-[10px] font-mono text-cyan-400/80 border-t border-cyan-900/40">
                    <span>STATUS: OK</span>
                    <span>{trace.timestamp || 'READY'}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Node Output Inspector Modal */}
      {selectedNodeTrace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel max-w-2xl w-full rounded-2xl p-6 border border-gray-700 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-heading">
                <Eye className="w-4 h-4 text-cyan-400" />
                Node Payload Inspector: {selectedNodeTrace.node_name}
              </h3>
              <button
                onClick={() => setSelectedNodeTrace(null)}
                className="text-gray-400 hover:text-white text-xs font-semibold px-2 py-1 bg-gray-800 rounded"
              >
                CLOSE [ESC]
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto font-mono text-xs">
              <div>
                <span className="text-gray-400 font-sans block mb-1 font-semibold text-xs">INPUT PAYLOAD:</span>
                <pre className="p-3 rounded-lg bg-gray-950 text-cyan-300 border border-gray-800 overflow-x-auto">
                  {JSON.stringify(selectedNodeTrace.input_payload, null, 2)}
                </pre>
              </div>

              <div>
                <span className="text-gray-400 font-sans block mb-1 font-semibold text-xs">OUTPUT PAYLOAD:</span>
                <pre className="p-3 rounded-lg bg-gray-950 text-emerald-300 border border-gray-800 overflow-x-auto">
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
