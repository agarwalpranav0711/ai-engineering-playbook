import React from 'react';
import { Award, AlertTriangle, ShieldAlert, Cpu, CheckCircle2, Clock } from 'lucide-react';

export default function ScoreDashboard({ review, processingTime }) {
  if (!review) return null;

  const score = review.overall_score;

  const getScoreColor = (val) => {
    if (val >= 75) return { text: 'text-emerald-400', ring: 'border-emerald-500/30' };
    if (val >= 55) return { text: 'text-amber-400', ring: 'border-amber-500/30' };
    return { text: 'text-rose-400', ring: 'border-rose-500/30' };
  };

  const scoreColor = getScoreColor(score);

  const bugCount = review.bugs?.length || 0;
  const securityCount = review.security_issues?.length || 0;
  const perfCount = review.performance_issues?.length || 0;
  const qualityCount = review.quality_issues?.length || 0;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Analysis Completed</span>
          <h2 className="text-xl font-bold text-white">Code Review Summary & Rating</h2>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Execution Time: {processingTime}s</span>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
        
        {/* Left: Overall Ring Score (2 cols) */}
        <div className="md:col-span-2 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center relative overflow-hidden">
          <div className="relative w-36 h-36 flex items-center justify-center rounded-full border-4 border-slate-800 shadow-inner">
            <div className={`absolute inset-0 rounded-full border-4 ${scoreColor.ring} animate-pulse`} />
            <div className="flex flex-col items-center justify-center">
              <span className={`text-5xl font-black ${scoreColor.text} tracking-tight`}>{score}</span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-widest mt-0.5">/ 100</span>
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <h3 className="text-base font-bold text-white">
              {score >= 75 ? 'Clean Code Quality' : score >= 55 ? 'Moderate Issues Found' : 'Critical Fixes Required'}
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              {review.summary}
            </p>
          </div>
        </div>

        {/* Right: Category Count Cards & Big-O (3 cols) */}
        <div className="md:col-span-3 grid grid-cols-2 gap-4">
          
          {/* Card 1: Bugs */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bugCount > 0 ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold text-white block">{bugCount}</span>
              <span className="text-xs text-slate-400 font-medium">Bugs / Logic Errors</span>
            </div>
          </div>

          {/* Card 2: Security */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${securityCount > 0 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400'}`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold text-white block">{securityCount}</span>
              <span className="text-xs text-slate-400 font-medium">Security Alerts</span>
            </div>
          </div>

          {/* Card 3: Time Complexity */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-purple-300 font-mono block">{review.complexity?.time_complexity || 'O(1)'}</span>
              <span className="text-xs text-slate-400 font-medium">Time Complexity</span>
            </div>
          </div>

          {/* Card 4: Space Complexity */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-bold text-cyan-300 font-mono block">{review.complexity?.space_complexity || 'O(1)'}</span>
              <span className="text-xs text-slate-400 font-medium">Space Complexity</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
