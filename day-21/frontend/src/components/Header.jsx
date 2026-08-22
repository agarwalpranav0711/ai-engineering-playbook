import React from 'react';
import { Code2, Sparkles, ShieldCheck, Terminal, Cpu } from 'lucide-react';

export default function Header({ reviewMode, setReviewMode }) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">AI Code Reviewer</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Day 21
              </span>
            </div>
            <p className="text-xs text-slate-400">Multi-Dimensional Static Analysis & Big-O Complexity Auditor</p>
          </div>
        </div>

        {/* Review Mode Selector & System Badge */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/80 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setReviewMode('full')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                reviewMode === 'full'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Full Review
            </button>
            <button
              onClick={() => setReviewMode('dsa')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                reviewMode === 'dsa'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              DSA & Complexity
            </button>
            <button
              onClick={() => setReviewMode('security')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                reviewMode === 'security'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Security Audit
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Strict Schema Grounding</span>
          </div>
        </div>

      </div>
    </header>
  );
}
