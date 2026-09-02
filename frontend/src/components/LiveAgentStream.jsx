import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Radio, ChevronDown, ChevronUp, RefreshCw, CheckCircle2, Shield } from 'lucide-react';
import { WS_LOGS_URL } from '../services/api';

export default function LiveAgentStream() {
  const [logs, setLogs] = useState([
    {
      id: 1,
      time: new Date().toLocaleTimeString(),
      type: 'INIT',
      status: 'AGENT_INITIALIZED',
      message: 'RESILIO 7-Node LangGraph Agent Control Plane Online'
    },
    {
      id: 2,
      time: new Date().toLocaleTimeString(),
      type: 'TELEMETRY',
      status: 'HEALTHY',
      message: 'Real-time bank telemetry monitor active across HDFC, ICICI, SBI, AXIS'
    }
  ]);
  const [isConnected, setIsConnected] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const wsRef = useRef(null);
  const logContainerRef = useRef(null);

  useEffect(() => {
    let reconnectTimeout = null;

    const connect = () => {
      try {
        const ws = new WebSocket(WS_LOGS_URL);
        wsRef.current = ws;

        ws.onopen = () => {
          setIsConnected(true);
          setLogs((prev) => [
            ...prev.slice(-40),
            {
              id: Date.now(),
              time: new Date().toLocaleTimeString(),
              type: 'CONNECTED',
              status: 'WS_SYNC_OK',
              message: 'Connected to live agent log stream'
            }
          ]);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            setLogs((prev) => [
              ...prev.slice(-40),
              {
                id: Date.now() + Math.random(),
                time: data.timestamp || new Date().toLocaleTimeString(),
                type: data.type || 'HEARTBEAT',
                status: data.status || 'OK',
                message: data.message || `Autonomous Recovery Daemon heartbeat • ${data.status}`
              }
            ]);
          } catch (e) {
            // plain text fallback
            setLogs((prev) => [
              ...prev.slice(-40),
              {
                id: Date.now(),
                time: new Date().toLocaleTimeString(),
                type: 'HEARTBEAT',
                status: 'OK',
                message: event.data
              }
            ]);
          }
        };

        ws.onclose = () => {
          setIsConnected(false);
          reconnectTimeout = setTimeout(connect, 3000);
        };

        ws.onerror = () => {
          setIsConnected(false);
        };
      } catch (err) {
        setIsConnected(false);
        reconnectTimeout = setTimeout(connect, 3000);
      }
    };

    connect();

    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, []);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="glass-panel rounded-2xl border border-gray-800 overflow-hidden">
      {/* Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-6 py-3.5 bg-gray-950/80 border-b border-gray-800/80 flex items-center justify-between cursor-pointer hover:bg-gray-900/60 transition"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white font-heading">
                Live Agent Execution & Heartbeat Stream
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1 ${
                  isConnected
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                  }`}
                />
                {isConnected ? 'LIVE WS CONNECTED' : 'RECONNECTING'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-500 font-mono hidden sm:inline">
            /ws/agent-logs
          </span>
          <button className="text-gray-400 hover:text-white p-1">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Collapsible Terminal Content */}
      {isExpanded && (
        <div
          ref={logContainerRef}
          className="p-4 bg-gray-950/90 font-mono text-xs max-h-44 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-gray-800"
        >
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2.5 text-gray-400 hover:text-gray-200 transition">
              <span className="text-[10px] text-cyan-500/80 shrink-0 font-bold">[{log.time}]</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-bold shrink-0 ${
                  log.type === 'CONNECTED'
                    ? 'bg-emerald-950 text-emerald-400'
                    : log.type === 'TELEMETRY'
                    ? 'bg-blue-950 text-blue-400'
                    : 'bg-cyan-950 text-cyan-300'
                }`}
              >
                {log.status}
              </span>
              <span className="text-gray-300 text-[11px] leading-relaxed break-all">
                {log.message}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
