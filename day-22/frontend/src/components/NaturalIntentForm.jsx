import React, { useState } from 'react';
import { Wand2, Sparkles, Send } from 'lucide-react';

export default function NaturalIntentForm({ onExtractAndGenerate, loading }) {
  const [prompt, setPrompt] = useState('I need to email Professor Sharma asking for a 2-day extension on Assignment 3 because I had a high fever.');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onExtractAndGenerate(prompt);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Wand2 className="w-5 h-5 text-purple-400" />
        <div>
          <h2 className="text-lg font-bold text-white">Natural Language Email Request</h2>
          <p className="text-xs text-slate-400">Describe your situation naturally and let AI extract parameters</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          placeholder="Describe who you want to email and why e.g., 'I interviewed for a Software Developer role at Acme Corp last Friday and want to follow up with the recruiter.'"
          className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 focus:outline-none focus:border-purple-500 placeholder-slate-600 leading-relaxed resize-y font-medium"
        />

        <button
          type="submit"
          disabled={loading || !prompt.trim()}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-bold shadow-lg shadow-purple-600/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              Extracting Intent & Generating Email...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Extract Intent & Draft Email
            </>
          )}
        </button>
      </form>
    </div>
  );
}
