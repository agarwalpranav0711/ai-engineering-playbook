import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, Cpu, CheckCircle2, Copy, Check, ArrowRight, Code2, TestTube } from 'lucide-react';

export default function ReviewPanel({ review, onApplyFix }) {
  const [activeTab, setActiveTab] = useState('bugs'); // 'bugs', 'complexity', 'security', 'quality', 'tests', 'diff'
  const [copied, setCopied] = useState(false);

  if (!review) return null;

  const handleCopyCode = () => {
    if (review.improved_code) {
      navigator.clipboard.writeText(review.improved_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getSeverityBadge = (sev) => {
    const s = sev?.toLowerCase() || 'medium';
    if (s === 'high') return <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">HIGH SEVERITY</span>;
    if (s === 'medium') return <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">MEDIUM SEVERITY</span>;
    return <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">LOW SEVERITY</span>;
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
      
      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        
        <button
          onClick={() => setActiveTab('bugs')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'bugs'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Bugs & Logic ({review.bugs?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('complexity')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'complexity'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4" />
          Complexity & Perf ({review.performance_issues?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'security'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Security Audit ({review.security_issues?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('quality')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'quality'
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Quality & Edge Cases ({review.edge_cases?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('tests')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'tests'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800'
          }`}
        >
          <TestTube className="w-4 h-4" />
          Test Cases ({review.test_cases?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('diff')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'diff'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-slate-800'
          }`}
        >
          <Code2 className="w-4 h-4" />
          Refactored Code
        </button>

      </div>

      {/* TAB 1: BUGS */}
      {activeTab === 'bugs' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Logic Errors & Incorrect Code
          </h3>

          {review.bugs && review.bugs.length > 0 ? (
            <div className="space-y-3">
              {review.bugs.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {getSeverityBadge(item.severity)}
                      <h4 className="text-xs font-bold text-white">{item.title}</h4>
                    </div>
                    {item.line && (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] font-mono text-cyan-300">
                        Line {item.line}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{item.explanation}</p>

                  <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-xs space-y-1">
                    <span className="font-semibold text-indigo-400 block">💡 Actionable Fix:</span>
                    <p className="font-mono text-slate-200">{item.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              No correctness or logic bugs detected in the submitted code snippet!
            </div>
          )}
        </div>
      )}

      {/* TAB 2: COMPLEXITY & PERFORMANCE */}
      {activeTab === 'complexity' && (
        <div className="space-y-6">
          
          {/* Big-O Explanation */}
          <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15 space-y-2">
            <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" />
              Big-O Complexity Analysis
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-semibold">Time Complexity</span>
                <span className="text-xl font-bold font-mono text-purple-300">{review.complexity?.time_complexity}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[11px] text-slate-400 block font-semibold">Space Complexity</span>
                <span className="text-xl font-bold font-mono text-cyan-300">{review.complexity?.space_complexity}</span>
              </div>
            </div>
            <p className="text-xs text-slate-300 pt-2 leading-relaxed">{review.complexity?.explanation}</p>
          </div>

          {/* Performance Bottlenecks */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200">Performance Bottlenecks</h4>
            {review.performance_issues && review.performance_issues.length > 0 ? (
              review.performance_issues.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-purple-300">{item.title}</span>
                    {item.line && <span className="text-[11px] font-mono text-slate-400">Line {item.line}</span>}
                  </div>
                  <p className="text-slate-300">{item.explanation}</p>
                  <p className="font-mono text-indigo-300 bg-slate-950/60 p-2 rounded border border-slate-800">{item.suggestion}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">No major performance bottlenecks flagged.</p>
            )}
          </div>

        </div>
      )}

      {/* TAB 3: SECURITY AUDIT */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            Security & Credential Audit
          </h3>

          {review.security_issues && review.security_issues.length > 0 ? (
            <div className="space-y-3">
              {review.security_issues.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getSeverityBadge(item.severity)}
                      <h4 className="font-bold text-amber-200">{item.title}</h4>
                    </div>
                    {item.line && <span className="font-mono text-amber-400 text-[11px]">Line {item.line}</span>}
                  </div>
                  <p className="text-slate-200 leading-relaxed">{item.explanation}</p>
                  <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-amber-300 font-mono">
                    {item.suggestion}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              No hardcoded secrets or obvious security vulnerabilities detected.
            </div>
          )}
        </div>
      )}

      {/* TAB 4: QUALITY & EDGE CASES */}
      {activeTab === 'quality' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Readability & Quality */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-cyan-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Code Quality & Style
            </h3>
            <ul className="space-y-2">
              {review.quality_issues && review.quality_issues.length > 0 ? (
                review.quality_issues.map((item, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-200 space-y-1">
                    <span className="font-semibold text-cyan-300 block">{item.title}</span>
                    <p className="text-slate-400">{item.explanation}</p>
                  </li>
                ))
              ) : (
                <p className="text-xs text-slate-500">Code structure and variable naming look good.</p>
              )}
            </ul>
          </div>

          {/* Edge Cases */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              Boundary & Edge Cases to Consider
            </h3>
            <ul className="space-y-2">
              {review.edge_cases && review.edge_cases.length > 0 ? (
                review.edge_cases.map((ec, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/15 text-xs text-slate-200 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                    <span>{ec}</span>
                  </li>
                ))
              ) : (
                <p className="text-xs text-slate-500">Standard edge cases apply.</p>
              )}
            </ul>
          </div>

        </div>
      )}

      {/* TAB 5: TEST CASES */}
      {activeTab === 'tests' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TestTube className="w-4 h-4 text-blue-400" />
            Generated Verification Test Cases
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {review.test_cases && review.test_cases.length > 0 ? (
              review.test_cases.map((tc, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-blue-400">{tc.test_name}</span>
                  <div className="space-y-1 font-mono text-[11px]">
                    <div className="bg-slate-950 p-2 rounded text-slate-300">
                      <strong className="text-slate-500">Input: </strong> {tc.input_data}
                    </div>
                    <div className="bg-slate-950 p-2 rounded text-emerald-300">
                      <strong className="text-slate-500">Expected: </strong> {tc.expected_output}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 pt-1">{tc.explanation}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">No test cases generated.</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: REFACTORED CODE DIFF */}
      {activeTab === 'diff' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                Refactored & Improved Code Rewrite
              </h3>
              <p className="text-xs text-slate-400">Cleaned version applying boundary safety and best practices</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>

              {onApplyFix && (
                <button
                  onClick={() => onApplyFix(review.improved_code)}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 transition-all shadow-md shadow-emerald-600/20"
                >
                  Apply to Editor
                </button>
              )}
            </div>
          </div>

          {/* List of Changes Applied */}
          {review.changes_made && review.changes_made.length > 0 && (
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-xs space-y-1">
              <span className="font-semibold text-emerald-400 block">✨ Improvements Applied:</span>
              <ul className="list-disc list-inside text-slate-300 space-y-0.5 font-mono text-[11px]">
                {review.changes_made.map((ch, idx) => (
                  <li key={idx}>{ch}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Code Viewer */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed shadow-inner">
            <pre>{review.improved_code}</pre>
          </div>
        </div>
      )}

    </div>
  );
}
