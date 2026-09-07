import React from 'react';
import { Play, Sparkles, FolderOpen, Save, Trash2, Code2, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Header({
  isExecuting,
  backendConnected,
  onRunWorkflow,
  onLoadPreset,
  onSaveWorkflow,
  onLoadSavedWorkflow,
  onClearCanvas,
  onToggleJsonModal,
  selectedPreset
}) {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between z-20 shrink-0">
      {/* Brand & App Title */}
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h1 className="text-base font-bold bg-gradient-to-r from-slate-100 via-slate-200 to-indigo-300 bg-clip-text text-transparent flex items-center gap-2">
            AI Workflow Builder
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Day 27
            </span>
          </h1>
          <p className="text-[11px] text-slate-400">Visual Graph Editor & Execution Engine</p>
        </div>
      </div>

      {/* Center Control Group: Presets & Storage */}
      <div className="flex items-center space-x-3">
        {/* Preset Selector */}
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1">
          <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs text-slate-400 font-medium">Presets:</span>
          <select
            value={selectedPreset}
            onChange={(e) => onLoadPreset(e.target.value)}
            className="bg-transparent text-xs text-slate-200 font-medium focus:outline-none cursor-pointer"
          >
            <option value="basic" className="bg-slate-900 text-slate-200">1. Basic Workflow</option>
            <option value="summarizer" className="bg-slate-900 text-slate-200">2. Summarizer</option>
            <option value="translator" className="bg-slate-900 text-slate-200">3. Translator</option>
            <option value="email" className="bg-slate-900 text-slate-200">4. Email Generator</option>
            <option value="multi-ai" className="bg-slate-900 text-slate-200">5. Multi-AI Pipeline</option>
          </select>
        </div>

        {/* LocalStorage Save / Load */}
        <div className="flex items-center space-x-1 border-l border-slate-800 pl-3">
          <button
            onClick={onSaveWorkflow}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition"
            title="Save Workflow to localStorage"
          >
            <Save className="w-4 h-4" />
          </button>
          <button
            onClick={onLoadSavedWorkflow}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition"
            title="Load Workflow from localStorage"
          >
            <FolderOpen className="w-4 h-4" />
          </button>
          <button
            onClick={onClearCanvas}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
            title="Clear Canvas"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right Action Group: View JSON & Run Workflow */}
      <div className="flex items-center space-x-3">
        {/* Backend Status Badge */}
        <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900 border border-slate-800">
          {backendConnected ? (
            <>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Backend Ready</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-amber-400">Offline Fallback</span>
            </>
          )}
        </div>

        {/* JSON Graph View Button */}
        <button
          onClick={onToggleJsonModal}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition"
        >
          <Code2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Workflow JSON</span>
        </button>

        {/* Run Workflow Button */}
        <button
          onClick={onRunWorkflow}
          disabled={isExecuting}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-lg transition-all ${
            isExecuting
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20 active:scale-95'
          }`}
        >
          <Play className={`w-4 h-4 fill-current ${isExecuting ? 'animate-spin' : ''}`} />
          <span>{isExecuting ? 'Executing Graph...' : 'Run Workflow'}</span>
        </button>
      </div>
    </header>
  );
}
