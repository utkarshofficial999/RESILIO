import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CheckoutSimulator from './components/CheckoutSimulator';
import AutonomousIntelligenceHub from './components/AutonomousIntelligenceHub';
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
  
  const [history, setHistory] = useState([]);
  const [abReport, setAbReport] = useState(null);
  const [showABModal, setShowABModal] = useState(false);
  const [showAsyncModal, setShowAsyncModal] = useState(false);
  const [lastSimulatedAmount, setLastSimulatedAmount] = useState(4999);

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
    if (payload.amount_in_cents) {
      setLastSimulatedAmount(payload.amount_in_cents / 100);
    }
    try {
      const result = await api.processFailure(payload);
      setLatestResult(result);
      
      // Append to persistent history ledger
      if (result && result.execution_result) {
        const newEvent = {
          attempt_number: history.length + 1,
          strategy: result.selected_strategy || 'AUTONOMOUS_RECOVERY',
          status: result.status || 'SUCCESS',
          details: result.execution_result.message || 'Payment intercepted and evaluated by Resilio Multi-Agent workflow.',
          timestamp: new Date().toLocaleTimeString()
        };
        setHistory((prev) => [newEvent, ...prev]);
      }

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

  const handleConfirmUIFlip = () => {
    if (latestResult) {
      const updated = {
        ...latestResult,
        status: 'SUCCESS',
        execution_result: {
          ...latestResult.execution_result,
          message: 'Customer completed 1-Tap UPI Intent switch. Payment captured successfully!'
        }
      };
      setLatestResult(updated);

      const newEvent = {
        attempt_number: history.length + 1,
        strategy: 'UI_FLIP (CAPTURED)',
        status: 'SUCCESS',
        details: 'User tapped PhonePe/GPay 1-Tap Intent. 100% GMV captured with zero drop-off.',
        timestamp: new Date().toLocaleTimeString()
      };
      setHistory((prev) => [newEvent, ...prev]);
      fetchInitialData();
    }
  };

  const handleCompleteAsyncPayment = () => {
    if (latestResult) {
      const updated = {
        ...latestResult,
        status: 'SUCCESS',
        execution_result: {
          ...latestResult.execution_result,
          message: 'Customer clicked WhatsApp checkout link. Cart payment captured successfully!'
        }
      };
      setLatestResult(updated);

      const newEvent = {
        attempt_number: history.length + 1,
        strategy: 'ASYNC_RECOVERY (RECOVERED)',
        status: 'SUCCESS',
        details: 'Simulated customer opened WhatsApp notification and completed checkout.',
        timestamp: new Date().toLocaleTimeString()
      };
      setHistory((prev) => [newEvent, ...prev]);
      fetchInitialData();
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
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
    <div className="min-h-screen bg-[#07090E] text-slate-100 pb-12 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Header Navigation */}
      <Header
        onInjectOutage={handleInjectOutage}
        onResetTelemetry={handleResetTelemetry}
        onRunDemo={handleRunABDemo}
        isOutageActive={isOutageActive}
      />

      {/* Main Control Plane Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Executive Analytics KPI Bar */}
        <ExecutiveAnalytics analyticsData={analytics} />

        {/* Hero Interactive Split Plane: Checkout Sandbox & Intelligence Hub */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <CheckoutSimulator
            onSimulateFailure={handleProcessFailure}
            onConfirmUIFlip={handleConfirmUIFlip}
            isProcessing={isProcessing}
            recoveryResult={latestResult}
          />

          <AutonomousIntelligenceHub
            latestResult={latestResult}
            telemetry={telemetry}
            isProcessing={isProcessing}
          />
        </div>

        {/* Event Timeline Ledger */}
        <TransactionTimeline
          history={history}
          onClearHistory={handleClearHistory}
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
        onCompletePayment={handleCompleteAsyncPayment}
        amount={lastSimulatedAmount}
      />
    </div>
  );
}


