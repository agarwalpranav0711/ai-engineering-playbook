import React from 'react';
import { Award, CheckCircle2, AlertCircle, Layout, Clock, ShieldAlert } from 'lucide-react';

export default function ScoreDashboard({ review, processingTime, modeUsed }) {
  if (!review) return null;

  const score = review.overall_score;

  const getScoreColor = (val) => {
    if (val >= 75) return { text: 'text-emerald-400', bg: 'bg-emerald-500', ring: 'border-emerald-500/30' };
    if (val >= 55) return { text: 'text-amber-400', bg: 'bg-amber-500', ring: 'border-amber-500/30' };
    return { text: 'text-rose-400', bg: 'bg-rose-500', ring: 'border-rose-500/30' };
  };

  const mainColor = getScoreColor(score);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
      
      {/* Top Header & Disclaimer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Analysis Completed</span>
          <h2 className="text-xl font-bold text-white">AI Resume Match Scorecard</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{processingTime}s ({modeUsed === 'multi_agent' ? '4-Agent Pipeline' : 'Single Agent'})</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 font-medium">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>AI Match Score (Not Official ATS Formula)</span>
          </div>
        </div>
      </div>

      {/* Main Score Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
        
        {/* Left: Overall Ring Score (2 cols) */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center relative overflow-hidden">
          <div className="relative w-36 h-36 flex items-center justify-center rounded-full border-4 border-slate-800 shadow-inner">
            <div className={`absolute inset-0 rounded-full border-4 ${mainColor.ring} animate-pulse`} />
            <div className="flex flex-col items-center justify-center">
              <span className={`text-5xl font-black ${mainColor.text} tracking-tight`}>{score}</span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-widest mt-0.5">/ 100</span>
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <h3 className="text-base font-bold text-white">
              {score >= 75 ? 'Strong Role Alignment' : score >= 55 ? 'Moderate Role Alignment' : 'Significant Gaps Identified'}
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              {review.summary}
            </p>
          </div>
        </div>

        {/* Right: Sub-Score Progress Bars (3 cols) */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Card 1: Skills Match */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Skills Match (30%)
              </span>
              <span className={getScoreColor(review.skills_match_score).text}>{review.skills_match_score}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${getScoreColor(review.skills_match_score).bg}`}
                style={{ width: `${review.skills_match_score}%` }}
              />
            </div>
          </div>

          {/* Card 2: Experience Match */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-purple-400" />
                Experience Match (25%)
              </span>
              <span className={getScoreColor(review.experience_match_score).text}>{review.experience_match_score}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${getScoreColor(review.experience_match_score).bg}`}
                style={{ width: `${review.experience_match_score}%` }}
              />
            </div>
          </div>

          {/* Card 3: Project Match */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-indigo-400" />
                Project Match (20%)
              </span>
              <span className={getScoreColor(review.project_match_score).text}>{review.project_match_score}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${getScoreColor(review.project_match_score).bg}`}
                style={{ width: `${review.project_match_score}%` }}
              />
            </div>
          </div>

          {/* Card 4: Parseability / Formatting */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Layout className="w-4 h-4 text-sky-400" />
                Parseability & Layout (15%)
              </span>
              <span className={getScoreColor(review.formatting_score).text}>{review.formatting_score}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-700 ${getScoreColor(review.formatting_score).bg}`}
                style={{ width: `${review.formatting_score}%` }}
              />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
