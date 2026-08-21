import React, { useState } from 'react';
import { Send, Sparkles, AlertCircle } from 'lucide-react';

export default function ChatInput({ onSend, loading, disabled }) {
  const [question, setQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || loading || disabled) return;
    onSend(question.trim());
    setQuestion('');
  };

  const handleChipClick = (sampleQuestion) => {
    if (loading || disabled) return;
    onSend(sampleQuestion);
  };

  return (
    <div className="glass-panel rounded-2xl p-4 border border-slate-800 shadow-xl space-y-3">
      
      {/* Sample Prompt Chips */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-purple-400" /> Test Prompts:
        </span>
        
        <button
          type="button"
          onClick={() => handleChipClick("What is RAG and why is it useful?")}
          disabled={disabled || loading}
          className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-900 border border-slate-800 text-purple-300 hover:border-purple-500/50 hover:bg-slate-800 transition-all disabled:opacity-50"
        >
          What is RAG?
        </button>

        <button
          type="button"
          onClick={() => handleChipClick("Explain text chunking and vector embeddings.")}
          disabled={disabled || loading}
          className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-900 border border-slate-800 text-purple-300 hover:border-purple-500/50 hover:bg-slate-800 transition-all disabled:opacity-50"
        >
          What is Chunking?
        </button>

        <button
          type="button"
          onClick={() => handleChipClick("What does the document say about quantum computing?")}
          disabled={disabled || loading}
          className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-900 border border-slate-800 text-amber-300 hover:border-amber-500/50 hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center gap-1"
        >
          <AlertCircle className="w-3 h-3" />
          Test Out-of-Doc Query
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={disabled ? "Please upload a PDF document first..." : "Ask a question about the uploaded document..."}
          disabled={disabled || loading}
          className="flex-1 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!question.trim() || loading || disabled}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
}
