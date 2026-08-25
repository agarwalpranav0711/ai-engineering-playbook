import React, { useState } from 'react';
import Header from './components/Header';
import TranscriptInput from './components/TranscriptInput';
import SummaryDashboard from './components/SummaryDashboard';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summaryResult, setSummaryResult] = useState(null);
  const [strategyUsed, setStrategyUsed] = useState(null);
  const [processingTime, setProcessingTime] = useState(0.0);
  const [lastRequest, setLastRequest] = useState(null);

  const handleSummarize = async (reqData) => {
    setLoading(true);
    setError(null);
    setSummaryResult(null);
    setLastRequest(reqData);

    try {
      const res = await fetch('/api/summarize', {
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
        throw new Error(data.error || 'Failed to summarize meeting transcript');
      }

      setSummaryResult(data.summary);
      setStrategyUsed(data.strategy_used);
      setProcessingTime(data.processing_time_sec);
    } catch (err) {
      console.error("Summarization Error:", err);
      setError(err.message || 'An unexpected error occurred during summarization.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (lastRequest) {
      handleSummarize(lastRequest);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 radial-glow-purple selection:bg-purple-500 selection:text-white pb-16">
      
      {/* Navbar Header */}
      <Header strategyUsed={strategyUsed} />

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* Title */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            AI Meeting <span className="gradient-text-purple">Intelligence</span>
          </h2>
          <p className="text-sm text-slate-400">
            Transform raw meeting dialogues into structured decisions, assigned action items with deadlines, open risks, and exportable meeting notes.
          </p>
        </div>

        {/* Transcript Input Form */}
        <TranscriptInput onSummarize={handleSummarize} loading={loading} />

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <strong className="font-semibold block text-rose-200">Summarization Error</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Structured Summary Dashboard */}
        {summaryResult && (
          <SummaryDashboard
            summary={summaryResult}
            strategyUsed={strategyUsed}
            processingTime={processingTime}
            onRegenerate={handleRegenerate}
            loading={loading}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        AI Meeting Summarizer • Built for Day 23 AI Engineering Challenge • FastAPI + Pydantic + React + Vite + OpenRouter
      </footer>

    </div>
  );
}
