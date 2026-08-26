import React from 'react';
import { Search, Sparkles, ShieldCheck, Compass, Sliders } from 'lucide-react';

export default function Header({ depth }) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Search className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">AI Research Assistant</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Day 24
              </span>
            </div>
            <p className="text-xs text-slate-400">Multi-Query Web Search, Evidence Extraction & Citation Grounding Engine</p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-3">
          {depth && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300">
              <Sliders className="w-3.5 h-3.5" />
              <span>Depth Mode: {depth.toUpperCase()}</span>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Citation Grounded [1][2]</span>
          </div>
        </div>

      </div>
    </header>
  );
}
