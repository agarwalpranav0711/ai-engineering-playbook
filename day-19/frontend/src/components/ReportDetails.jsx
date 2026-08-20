import React, { useState } from 'react';
import { Target, Lightbulb, Edit3, AlertOctagon, CheckCircle2, XCircle, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ReportDetails({ review }) {
  const [activeTab, setActiveTab] = useState('skills'); // 'skills', 'insights', 'bullets', 'parsing'

  if (!review) return null;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
      
      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        
        <button
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'skills'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800'
          }`}
        >
          <Target className="w-4 h-4" />
          Skill Alignment ({review.skill_breakdown?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('insights')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'insights'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          Strengths & Recommendations ({review.recommendations?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('bullets')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'bullets'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          Weak Bullets ({review.weak_bullets?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('parsing')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'parsing'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          Parsing Warnings ({review.parsing_concerns?.length || 0})
        </button>

      </div>

      {/* TAB 1: Skills Matrix */}
      {activeTab === 'skills' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-400" />
              Required & Preferred Skills Breakdown
            </h3>
            <span className="text-xs text-slate-400">Strict Evidence Evaluation</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Skill Name</th>
                  <th className="px-4 py-3">Match Status</th>
                  <th className="px-4 py-3">Resume Evidence / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {review.skill_breakdown && review.skill_breakdown.length > 0 ? (
                  review.skill_breakdown.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/60 transition-colors">
                      <td className="px-4 py-3 font-semibold text-white">{item.skill_name}</td>
                      <td className="px-4 py-3">
                        {item.status === 'matched' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Matched
                          </span>
                        )}
                        {item.status === 'partial' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
                            <AlertTriangle className="w-3.5 h-3.5" /> Partial
                          </span>
                        )}
                        {item.status === 'missing' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
                            <XCircle className="w-3.5 h-3.5" /> Missing
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-300 font-mono text-[11px] leading-relaxed">
                        {item.evidence_or_reason}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-slate-500">
                      No skill breakdown items generated.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Strengths & Recommendations */}
      {activeTab === 'insights' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Strengths */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Verified Resume Strengths
            </h3>
            <ul className="space-y-2">
              {review.strengths && review.strengths.length > 0 ? (
                review.strengths.map((s, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-xs text-slate-200 flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))
              ) : (
                <p className="text-xs text-slate-500">No explicit strengths highlighted.</p>
              )}
            </ul>
          </div>

          {/* Actionable Recommendations */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Actionable Recommendations
            </h3>
            <ul className="space-y-2">
              {review.recommendations && review.recommendations.length > 0 ? (
                review.recommendations.map((r, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/15 text-xs text-slate-200 flex items-start gap-2.5">
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                    <span>{r}</span>
                  </li>
                ))
              ) : (
                <p className="text-xs text-slate-500">No specific recommendations provided.</p>
              )}
            </ul>
          </div>

        </div>
      )}

      {/* TAB 3: Weak Bullets */}
      {activeTab === 'bullets' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-purple-400" />
              Bullet Point Rewrite Auditor
            </h3>
            <span className="text-xs text-slate-400">Transform weak descriptions into impact-driven bullets</span>
          </div>

          {review.weak_bullets && review.weak_bullets.length > 0 ? (
            <div className="space-y-3">
              {review.weak_bullets.map((b, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      Original: "{b.original_bullet}"
                    </span>
                    <span className="text-xs text-amber-400 font-medium">Issue: {b.issue}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200 space-y-1">
                    <span className="font-semibold text-indigo-400 block">💡 Suggested Evidence-Based Rewrite:</span>
                    <p className="font-mono text-slate-200">{b.suggested_improvement}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800">
              No weak bullet points flagged. Bullet quality appears solid!
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Parsing Concerns */}
      {activeTab === 'parsing' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-amber-400" />
            Parseability & Formatting Risk Items
          </h3>

          {review.parsing_concerns && review.parsing_concerns.length > 0 ? (
            <div className="space-y-2">
              {review.parsing_concerns.map((c, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              No structural parsing or layout concerns detected. Resume is cleanly structured!
            </div>
          )}
        </div>
      )}

    </div>
  );
}
