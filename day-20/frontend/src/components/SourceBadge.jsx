import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, Search } from 'lucide-react';

export default function SourceBadge({ sources }) {
  const [expanded, setExpanded] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3 pt-2 border-t border-slate-800/80 space-y-2">
      
      {/* Sources Toggle Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1.5"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Retrieved Page Sources ({sources.length})</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Source Badges Row */}
      <div className="flex flex-wrap items-center gap-1.5">
        {sources.map((src, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedSource(selectedSource === idx ? null : idx)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all flex items-center gap-1.5 ${
              selectedSource === idx
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-purple-500/40 hover:text-white'
            }`}
          >
            <FileText className="w-3 h-3 text-purple-400" />
            Page {src.page_number}
            {src.score > 0 && <span className="text-[10px] opacity-70">({(src.score * 100).toFixed(0)}% match)</span>}
          </button>
        ))}
      </div>

      {/* Snippet Drawer if expanded or selected */}
      {(expanded || selectedSource !== null) && (
        <div className="mt-2 space-y-2">
          {sources.map((src, idx) => {
            if (selectedSource !== null && selectedSource !== idx) return null;
            return (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/90 border border-purple-900/40 text-xs space-y-1">
                <div className="flex items-center justify-between text-purple-300 font-semibold text-[11px]">
                  <span>📄 Page {src.page_number} Context Snippet</span>
                  <span>Similarity Score: {(src.score * 100).toFixed(1)}%</span>
                </div>
                <p className="font-mono text-slate-300 text-[11px] leading-relaxed bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                  "{src.snippet}"
                </p>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
