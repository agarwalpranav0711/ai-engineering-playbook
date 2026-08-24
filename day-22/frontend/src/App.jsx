import React, { useState } from 'react';
import Header from './components/Header';
import EmailForm from './components/EmailForm';
import NaturalIntentForm from './components/NaturalIntentForm';
import EmailDisplay from './components/EmailDisplay';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [inputMode, setInputMode] = useState('guided'); // 'guided' | 'natural'
  const [loading, setLoading] = useState(false);
  const [rewriteLoading, setRewriteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailResult, setEmailResult] = useState(null);
  const [processingTime, setProcessingTime] = useState(0.0);
  const [lastRequest, setLastRequest] = useState(null);

  const handleGenerate = async (reqData) => {
    setLoading(true);
    setError(null);
    setEmailResult(null);
    setLastRequest(reqData);

    try {
      const res = await fetch('/api/email/generate', {
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
        throw new Error(data.error || 'Failed to generate email');
      }

      setEmailResult(data.email);
      setProcessingTime(data.processing_time_sec);
    } catch (err) {
      console.error("Email Generation Error:", err);
      setError(err.message || 'An unexpected error occurred during email generation.');
    } finally {
      setLoading(false);
    }
  };

  const handleNaturalExtract = async (naturalPrompt) => {
    setLoading(true);
    setError(null);
    setEmailResult(null);

    try {
      const resIntent = await fetch('/api/email/extract-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ natural_prompt: naturalPrompt }),
      });

      if (!resIntent.ok) {
        throw new Error("Failed to extract intent from prompt.");
      }

      const intentData = await resIntent.json();
      if (!intentData.success || !intentData.extracted_intent) {
        throw new Error(intentData.error || "Intent extraction failed.");
      }

      const extracted = intentData.extracted_intent;
      const reqData = {
        email_type: extracted.email_type,
        recipient: extracted.recipient,
        purpose: extracted.purpose,
        context: extracted.context,
        tone: extracted.tone,
        length: extracted.length,
        sender_name: 'Pranav',
      };

      await handleGenerate(reqData);

    } catch (err) {
      console.error("Natural Intent Error:", err);
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleRewrite = async (instruction) => {
    if (!emailResult) return;
    setRewriteLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/email/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email_subject: emailResult.subject,
          email_body: emailResult.body,
          instruction: instruction,
          sender_name: lastRequest?.sender_name || 'Pranav',
        }),
      });

      if (!res.ok) throw new Error("Failed to rewrite email.");

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Rewrite failed.");

      setEmailResult(data.email);
      setProcessingTime(data.processing_time_sec);
    } catch (err) {
      console.error("Rewrite Error:", err);
      setError(err.message || "An error occurred during rewrite.");
    } finally {
      setRewriteLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (lastRequest) {
      handleGenerate(lastRequest);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 radial-glow-indigo selection:bg-indigo-500 selection:text-white pb-16">
      
      {/* Header Navbar */}
      <Header inputMode={inputMode} setInputMode={setInputMode} />

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* Title */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Controlled AI <span className="gradient-text-indigo">Email Writer</span>
          </h2>
          <p className="text-sm text-slate-400">
            Synthesize context-aware emails with strict anti-hallucination factual grounding, tone controls, and 1-click rewrites.
          </p>
        </div>

        {/* Input Form Mode */}
        {inputMode === 'guided' ? (
          <EmailForm onGenerate={handleGenerate} loading={loading} />
        ) : (
          <NaturalIntentForm onExtractAndGenerate={handleNaturalExtract} loading={loading} />
        )}

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <strong className="font-semibold block text-rose-200">Email Generation Error</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Email Output Display */}
        {emailResult && (
          <EmailDisplay
            email={emailResult}
            processingTime={processingTime}
            onRewrite={handleRewrite}
            onRegenerate={handleRegenerate}
            rewriteLoading={rewriteLoading}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        AI Email Writer • Built for Day 22 AI Engineering Challenge • FastAPI + Pydantic + React + Vite + OpenRouter
      </footer>

    </div>
  );
}
