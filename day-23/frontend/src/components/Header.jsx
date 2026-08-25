import React from 'react';
import { Bot, Sparkles, ShieldCheck, Cpu, Layers } from 'lucide-react';

export default function Header({ strategyUsed }) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">AI Meeting Summarizer</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Day 23
              </span>
            </div>
            <p className="text-xs text-slate-400">Structured Meeting Intelligence, Decisions & Action-Item Extractor</p>
          </div>
        </div>

        {/* System Badges */}
        <div className="flex items-center gap-3">
          {strategyUsed && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
              <Layers className="w-3.5 h-3.5" />
              <span>Strategy: {strategyUsed === 'hierarchical_map_reduce' ? 'Map-Reduce Chunker' : 'Direct LLM Pass'}</span>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Anti-Hallucination Grounded</span>
          </div>
        </div>

      </div>
    </header>
  );
}
