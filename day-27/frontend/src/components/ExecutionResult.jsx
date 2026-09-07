import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Clock, Layers, Copy, Check, Code2, Sparkles, Terminal } from 'lucide-react';

export default function ExecutionResult({
  executionResult,
  workflowJson,
  showJsonModal,
  onCloseJsonModal,
  onCloseResult
}) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('output'); // 'output' | 'steps' | 'json'

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(workflowJson, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (showJsonModal) {
    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center space-x-2">
              <Code2 className="w-5 h-5 text-indigo-400" />
              <h2 className="text-sm font-bold text-slate-100">Workflow Serialized JSON</h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyJson}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
              </button>
              <button
                onClick={onCloseJsonModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto font-mono text-xs text-indigo-200 bg-slate-950 leading-relaxed">
            <pre>{JSON.stringify(workflowJson, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  }

  if (!executionResult) return null;

  const { success, output, execution_time_seconds, steps, error } = executionResult;

  return (
    <div className="absolute bottom-4 left-72 right-84 z-20 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-80 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
      {/* Header Bar */}
      <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {success ? (
              <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
                <span>Workflow Executed Successfully</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 text-rose-400 text-xs font-semibold bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                <AlertTriangle className="w-4 h-4" />
                <span>Execution Error</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              {execution_time_seconds ? `${execution_time_seconds}s` : '0s'}
            </span>
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              {steps ? `${steps.length} Steps` : '0 Steps'}
            </span>
          </div>
        </div>

        {/* Tab Switcher & Close */}
        <div className="flex items-center space-x-3">
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('output')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                activeTab === 'output' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Output
            </button>
            <button
              onClick={() => setActiveTab('steps')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                activeTab === 'steps' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Step Logs ({steps ? steps.length : 0})
            </button>
          </div>

          <button
            onClick={onCloseResult}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5 overflow-y-auto text-xs space-y-3">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono">
            {error}
          </div>
        )}

        {activeTab === 'output' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="font-semibold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Final Output Result
              </span>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-200 leading-relaxed font-sans whitespace-pre-wrap select-text">
              {output || <span className="text-slate-600 italic">No output generated.</span>}
            </div>
          </div>
        )}

        {activeTab === 'steps' && (
          <div className="space-y-2">
            {steps && steps.map((step, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] text-slate-500">#{idx + 1}</span>
                    <span className="font-semibold text-slate-200">{step.node_label}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-900 text-indigo-400 border border-slate-800">
                      {step.node_type}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono truncate max-w-lg">
                    Out: {JSON.stringify(step.output_data)}
                  </div>
                </div>
                <div className="text-right text-[10px] font-mono text-slate-500">
                  {step.execution_time_seconds}s
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
