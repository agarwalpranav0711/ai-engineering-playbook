import React, { useState } from 'react';
import Header from './components/Header';
import CodeInput from './components/CodeInput';
import ScoreDashboard from './components/ScoreDashboard';
import ReviewPanel from './components/ReviewPanel';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [reviewMode, setReviewMode] = useState('full'); // 'full', 'dsa', 'bugs', 'security', 'performance'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reviewResult, setReviewResult] = useState(null);
  const [processingTime, setProcessingTime] = useState(0.0);

  const handleReview = async ({ language, code, review_mode }) => {
    setLoading(true);
    setError(null);
    setReviewResult(null);

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language,
          code,
          review_mode,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ detail: 'API Error' }));
        throw new Error(errData.detail || `Server error ${res.status}`);
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to complete code review');
      }

      setReviewResult(data.review);
      setProcessingTime(data.processing_time_sec);

    } catch (err) {
      console.error("Code Review Error:", err);
      setError(err.message || 'An unexpected error occurred during review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 radial-glow-cyan selection:bg-cyan-500 selection:text-white pb-16">
      
      {/* Top Navbar Header */}
      <Header reviewMode={reviewMode} setReviewMode={setReviewMode} />

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* Title */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            AI Static <span className="gradient-text-cyan">Code Reviewer</span>
          </h2>
          <p className="text-sm text-slate-400">
            Multi-dimensional code evaluation: Correctness, Big-O Complexity, Security Audits, Line-Level Bug Detection & Refactored Rewrites.
          </p>
        </div>

        {/* Code Input Section */}
        <CodeInput
          onReview={handleReview}
          loading={loading}
          reviewMode={reviewMode}
          setReviewMode={setReviewMode}
        />

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <strong className="font-semibold block text-rose-200">Analysis Error</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Review Results */}
        {reviewResult && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ScoreDashboard review={reviewResult} processingTime={processingTime} />
            <ReviewPanel review={reviewResult} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        AI Code Reviewer • Built for Day 21 AI Engineering Challenge • FastAPI + Pydantic + React + Vite + OpenRouter
      </footer>

    </div>
  );
}
