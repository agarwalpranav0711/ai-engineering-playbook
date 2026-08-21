import React from 'react';
import { FileText, Sparkles, Database, RefreshCw, ShieldCheck } from 'lucide-react';

export default function Header({ documentInfo, onResetDocument }) {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">AI PDF Chat</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Day 20 RAG
              </span>
            </div>
            <p className="text-xs text-slate-400">Retrieval-Augmented Generation with Page Citations</p>
          </div>
        </div>

        {/* Document Status & Controls */}
        <div className="flex items-center gap-3">
          {documentInfo ? (
            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-200 font-medium truncate max-w-[150px]">{documentInfo.filename}</span>
              <span className="text-slate-400 font-mono">({documentInfo.total_pages} pages, {documentInfo.total_chunks} chunks)</span>
              
              <button
                onClick={onResetDocument}
                title="Upload another PDF"
                className="ml-1 p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Vector Database Ready</span>
            </div>
          )}

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Strict Document Grounding</span>
          </div>
        </div>

      </div>
    </header>
  );
}
