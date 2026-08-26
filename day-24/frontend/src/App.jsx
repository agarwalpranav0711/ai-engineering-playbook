import React, { useState } from 'react';
import Header from './components/Header';
import ResearchInput from './components/ResearchInput';
import ResearchProgress from './components/ResearchProgress';
import ResearchReportView from './components/ResearchReportView';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportResult, setReportResult] = useState(null);
  const [searchQueries, setSearchQueries] = useState([]);
  const [processingTime, setProcessingTime] = useState(0.0);
  const [depth, setDepth] = useState('standard');
  const [lastRequest, setLastRequest] = useState(null);

  const handleResearch = async (reqData) => {
    setLoading(true);
    setError(null);
    setReportResult(null);
    setSearchQueries([]);
    setDepth(reqData.depth);
    setLastRequest(reqData);

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqData),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ detail: 'API Error' }));
        throw new Error(errData.detail || `Server error ${res.status}`);
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to conduct AI research');
      }

      setReportResult(data.report);
      setSearchQueries(data.search_queries_used || []);
      setProcessingTime(data.processing_time_sec);
    } catch (err) {
      console.error("Research Error:", err);
      setError(err.message || 'An unexpected error occurred during research execution.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (lastRequest) {
      handleResearch(lastRequest);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 radial-glow-cyan selection:bg-cyan-500 selection:text-white pb-16">
      
      {/* Navbar Header */}
      <Header depth={depth} />

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* Title */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            AI Research <span className="gradient-text-cyan">Assistant</span>
          </h2>
          <p className="text-sm text-slate-400">
            Multi-query web search, evidence extraction, citation grounding ([1][2]), and cross-source contradiction analysis engine.
          </p>
        </div>

        {/* Question Input Form */}
        <ResearchInput onResearch={handleResearch} loading={loading} />

        {/* Pipeline Stage Progress Stepper */}
        <ResearchProgress loading={loading} />

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <strong className="font-semibold block text-rose-200">Research Error</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Synthesized Research Report */}
        {reportResult && (
          <ResearchReportView
            report={reportResult}
            searchQueries={searchQueries}
            processingTime={processingTime}
            onRegenerate={handleRegenerate}
            loading={loading}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        AI Research Assistant • Built for Day 24 AI Engineering Challenge • FastAPI + Pydantic + React + Vite + OpenRouter
      </footer>

    </div>
  );
}
