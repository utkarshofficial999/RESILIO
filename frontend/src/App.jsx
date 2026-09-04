import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CheckoutSimulator from './components/CheckoutSimulator';
import AutonomousIntelligenceHub from './components/AutonomousIntelligenceHub';
import ExecutiveAnalytics from './components/ExecutiveAnalytics';
import ABSimulationModal from './components/ABSimulationModal';
import AsyncOutreachModal from './components/AsyncOutreachModal';
import LiveRecoveryModal from './components/LiveRecoveryModal';
import TransactionTimeline from './components/TransactionTimeline';
import { api } from './services/api';
import {
  Home, Receipt, BarChart3, Settings, CreditCard, Link2, FileText,
  LayoutDashboard, Zap, Shield, Activity, HelpCircle, ChevronDown
} from 'lucide-react';

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
  const [showLiveRecoveryModal, setShowLiveRecoveryModal] = useState(false);
  const [lastSimulatedAmount, setLastSimulatedAmount] = useState(4999);
  const [activeNav, setActiveNav] = useState('dashboard');

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
      } else if (payload.gateway === 'RAZORPAY_LIVE_WIDGET') {
        setShowLiveRecoveryModal(true);
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

  const handleCompleteLiveRecovery = async () => {
    setShowLiveRecoveryModal(false);
    try {
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded');
      }

      const keyData = await api.getRazorpayKey();
      const order = await api.createRazorpayOrder(lastSimulatedAmount * 100);
      const orderId = order.order_id || order.id;

      const options = {
        key: keyData.key_id,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: "RESILIO — Autonomous Recovery",
        description: "Recovered via Healthy Rail (ICICI Bank)",
        image: "https://razorpay.com/favicon.png",
        order_id: orderId,
        prefill: {
          name: "Hackathon Tester",
          email: "test@razorpay.com",
          contact: "9045482200"
        },
        theme: {
          color: "#1CA672"
        },
        handler: async function (response) {
          try {
            await api.verifyPayment(response.razorpay_payment_id, response.razorpay_order_id);
          } catch (e) {}

          const updated = {
            ...latestResult,
            status: 'SUCCESS',
            execution_result: {
              ...latestResult?.execution_result,
              message: `Payment ${response.razorpay_payment_id} successfully captured on Razorpay via recovered rail!`
            }
          };
          setLatestResult(updated);

          const newEvent = {
            attempt_number: history.length + 1,
            strategy: 'AUTONOMOUS_RECOVERY (CAPTURED ON RAZORPAY)',
            status: 'SUCCESS',
            details: `Real Razorpay payment ${response.razorpay_payment_id} captured. Check Razorpay Dashboard!`,
            timestamp: new Date().toLocaleTimeString()
          };
          setHistory((prev) => [newEvent, ...prev]);
          fetchInitialData();
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Error initiating recovered checkout:', err);
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

  const sidebarNav = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'settlements', label: 'Settlements', icon: CreditCard },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  const sidebarProducts = [
    { id: 'recovery', label: 'Recovery Engine', icon: Zap, highlight: true },
    { id: 'links', label: 'Payment Links', icon: Link2 },
    { id: 'pages', label: 'Payment Pages', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA] text-[#1A202C] font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* ===== LEFT SIDEBAR — Razorpay Dashboard Style ===== */}
      <aside className="rzp-sidebar">
        {/* Logo Area */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-[#528FF0]" />
            </div>
            <div>
              <div className="text-base font-extrabold text-white tracking-tight leading-tight">RESILIO</div>
              <div className="text-[10px] text-blue-300/70 font-semibold tracking-wide">by Razorpay</div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 py-3 overflow-y-auto">
          <div className="rzp-sidebar-section">Main Menu</div>
          {sidebarNav.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`rzp-sidebar-item ${activeNav === item.id ? 'active' : ''}`}
                onClick={() => setActiveNav(item.id)}
              >
                <Icon className="w-[18px] h-[18px]" />
                <span>{item.label}</span>
              </div>
            );
          })}

          <div className="rzp-sidebar-section mt-2">Recovery Products</div>
          {sidebarProducts.map(item => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={`rzp-sidebar-item ${activeNav === item.id ? 'active' : ''}`}
                onClick={() => setActiveNav(item.id)}
              >
                <Icon className="w-[18px] h-[18px]" />
                <span>{item.label}</span>
                {item.highlight && (
                  <span className="ml-auto text-[9px] bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full font-bold">
                    NEW
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-white/10 px-5 py-4">
          <div className="flex items-center gap-2.5 text-xs">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-dot" />
            <span className="text-white/60 font-medium">Test Mode</span>
            <span className="ml-auto text-[10px] bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full font-bold border border-green-500/30">
              ACTIVE
            </span>
          </div>
          <div className="flex items-center gap-2 mt-3 cursor-pointer group">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/80">
              UY
            </div>
            <span className="text-xs text-white/60 group-hover:text-white/80 transition">Account & Settings</span>
          </div>
        </div>
      </aside>

      {/* ===== MAIN CONTENT AREA ===== */}
      <div className="ml-0 md:ml-[240px] min-h-screen flex flex-col">
        {/* Test Mode Banner Strip */}
        <div className="rzp-test-strip flex items-center justify-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
          <span>TEST MODE — All transactions are simulated. No real money will be debited.</span>
        </div>

        {/* Top Header Bar */}
        <Header
          onInjectOutage={handleInjectOutage}
          onResetTelemetry={handleResetTelemetry}
          onRunDemo={handleRunABDemo}
          isOutageActive={isOutageActive}
        />

        {/* Main Dashboard Content */}
        <main className="flex-1 px-6 lg:px-8 py-6 space-y-6 max-w-[1400px]">
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
      </div>

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

      {/* Real-time In-Front Live Recovery Action Modal */}
      <LiveRecoveryModal
        isOpen={showLiveRecoveryModal}
        onClose={() => setShowLiveRecoveryModal(false)}
        result={latestResult}
        amount={lastSimulatedAmount}
        onConfirmPayment={handleCompleteLiveRecovery}
      />
    </div>
  );
}
