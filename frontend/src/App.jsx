import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CheckoutSimulator from './components/CheckoutSimulator';
import AgentGraphVisualizer from './components/AgentGraphVisualizer';
import CounterfactualPanel from './components/CounterfactualPanel';
import LiveTelemetryDashboard from './components/LiveTelemetryDashboard';
import ExecutiveAnalytics from './components/ExecutiveAnalytics';
import ABSimulationModal from './components/ABSimulationModal';
import AsyncOutreachModal from './components/AsyncOutreachModal';
import TransactionTimeline from './components/TransactionTimeline';
import { api } from './services/api';

export default function App() {
  const [telemetry, setTelemetry] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [latestResult, setLatestResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOutageActive, setIsOutageActive] = useState(false);
  
  const [abReport, setAbReport] = useState(null);
  const [showABModal, setShowABModal] = useState(false);
  const [showAsyncModal, setShowAsyncModal] = useState(false);

  // Fetch initial telemetry and analytics
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const telemData = await api.getTelemetry();
      setTelemetry(telemData);

      const analData = await api.getAnalytics();
      setAnalytics(analData);
    } catch (err) {
      console.warn('Backend server connecting...', err);
    }
  };

  const handleInjectOutage = async () => {
    try {
      await api.injectOutage('HDFC', 0.42);
      setIsOutageActive(true);
      const telemData = await api.getTelemetry();
      setTelemetry(telemData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetTelemetry = async () => {
    try {
      await api.resetTelemetry();
      setIsOutageActive(false);
      const telemData = await api.getTelemetry();
      setTelemetry(telemData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProcessFailure = async (payload) => {
    setIsProcessing(true);
    try {
      const result = await api.processFailure(payload);
      setLatestResult(result);
      
      if (result.status === 'PARTIAL_SUCCESS') {
        setShowAsyncModal(true);
      }
      
      // Refresh telemetry & analytics after recovery
      fetchInitialData();
      return result;
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRunABDemo = async () => {
    try {
      const report = await api.runABSimulation(1000, isOutageActive ? 'HDFC' : null);
      setAbReport(report);
      setShowABModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 pb-12">
      {/* Header Navigation */}
      <Header
        onInjectOutage={handleInjectOutage}
        onResetTelemetry={handleResetTelemetry}
        onRunDemo={handleRunABDemo}
        isOutageActive={isOutageActive}
      />

      {/* Main Control Plane Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Executive Analytics Metrics Row */}
        <ExecutiveAnalytics analyticsData={analytics} />

        {/* Live Bank Health Telemetry */}
        <LiveTelemetryDashboard telemetry={telemetry} />

        {/* 7-Node Multi-Agent LangGraph Visualizer */}
        <AgentGraphVisualizer
          nodeTraces={latestResult?.node_traces || []}
          activeNodeIndex={isProcessing ? 3 : -1}
        />

        {/* Main Grid: Interactive Checkout Sandbox & Counterfactual Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CheckoutSimulator
            onSimulateFailure={handleProcessFailure}
            isProcessing={isProcessing}
            recoveryResult={latestResult}
          />

          <CounterfactualPanel
            counterfactual={latestResult?.counterfactual_explanation}
          />
        </div>

        {/* Event Timeline Ledger */}
        <TransactionTimeline
          history={
            latestResult?.execution_result
              ? [
                  {
                    attempt_number: 1,
                    strategy: latestResult.selected_strategy,
                    status: latestResult.status,
                    details: latestResult.execution_result.message
                  }
                ]
              : []
          }
        />
      </main>

      {/* 1-Click Signature A/B Benchmark Modal */}
      <ABSimulationModal
        report={abReport}
        onClose={() => setShowABModal(false)}
      />

      {/* Async WhatsApp Recovery Link Simulator Modal */}
      <AsyncOutreachModal
        isOpen={showAsyncModal}
        onClose={() => setShowAsyncModal(false)}
        amount={4999}
      />
    </div>
  );
}
