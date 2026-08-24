import React from 'react';
import { Mail, Sparkles, ShieldCheck, Wand2, FormInput } from 'lucide-react';

export default function Header({ inputMode, setInputMode }) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">AI Email Writer</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Day 22
              </span>
            </div>
            <p className="text-xs text-slate-400">Tone-Controlled Email Generation & Controlled Refinement Engine</p>
          </div>
        </div>

        {/* Input Mode Toggle & System Badge */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/80 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setInputMode('guided')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                inputMode === 'guided'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FormInput className="w-3.5 h-3.5" />
              Guided Controls
            </button>

            <button
              onClick={() => setInputMode('natural')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                inputMode === 'natural'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5" />
              Natural Intent
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Anti-Hallucination Safe</span>
          </div>
        </div>

      </div>
    </header>
  );
}
