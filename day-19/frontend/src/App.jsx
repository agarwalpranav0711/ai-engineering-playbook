import React, { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ScoreDashboard from './components/ScoreDashboard';
import ReportDetails from './components/ReportDetails';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState('single'); // 'single' or 'multi_agent'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reviewResult, setReviewResult] = useState(null);
  const [processingTime, setProcessingTime] = useState(0.0);
  const [modeUsed, setModeUsed] = useState('single');

  const handleAnalyze = async ({ file, resumeText, jobDescription, mode: selectedMode }) => {
    setLoading(true);
    setError(null);
    setReviewResult(null);

    try {
      let res;
      if (file) {
        // Multipart form upload
        const formData = new FormData();
        formData.append('file', file);
        formData.append('job_description', jobDescription);
        formData.append('mode', selectedMode);

        res = await fetch('/api/review', {
          method: 'POST',
          body: formData,
        });
      } else {
        // JSON post endpoint
        res = await fetch('/api/review/json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            resume_text: resumeText,
            job_description: jobDescription,
            mode: selectedMode,
          }),
        });
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ detail: 'API Server Error' }));
        throw new Error(errData.detail || `Server error ${res.status}`);
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to complete resume analysis');
      }

      setReviewResult(data.review);
      setProcessingTime(data.processing_time_sec);
      setModeUsed(data.mode_used);

    } catch (err) {
      console.error("Resume Review Error:", err);
      setError(err.message || 'An unexpected error occurred during review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 radial-glow selection:bg-indigo-500 selection:text-white pb-16">
      
      {/* Header Bar */}
      <Header mode={mode} setMode={setMode} />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* Hero Title */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            AI-Powered <span className="gradient-text">Resume Reviewer</span>
          </h2>
          <p className="text-sm text-slate-400">
            Transform unstructured resumes & job descriptions into evidence-backed, structured match scores, skill gap matrix, and bullet improvements.
          </p>
        </div>

        {/* Input Form Section */}
        <InputForm onAnalyze={handleAnalyze} loading={loading} mode={mode} />

        {/* Error Alert if any */}
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
            <ScoreDashboard review={reviewResult} processingTime={processingTime} modeUsed={modeUsed} />
            <ReportDetails review={reviewResult} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        AI Resume Reviewer • Built for Day 19 AI Engineering Challenge • FastAPI + Pydantic + React + Vite + Tailwind
      </footer>

    </div>
  );
}
