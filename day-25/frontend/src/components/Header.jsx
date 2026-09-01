import React from 'react';
import { Mic, Sparkles, ShieldCheck, Radio } from 'lucide-react';

export default function Header({ isRecording }) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-pink-600 to-purple-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">Voice-to-Notes AI</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Day 25
              </span>
            </div>
            <p className="text-xs text-slate-400">Microphone Recording, Speech-to-Text & Structured AI Notes Engine</p>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-3">
          {isRecording ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs font-bold text-rose-300 animate-pulse">
              <Radio className="w-3.5 h-3.5 text-rose-400 animate-spin" />
              <span>LIVE RECORDING ACTIVE</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>MediaRecorder & STT Ready</span>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
