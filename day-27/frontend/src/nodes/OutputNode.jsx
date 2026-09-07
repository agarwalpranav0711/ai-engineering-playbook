import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function OutputNode({ id, data, selected }) {
  const outputText = data.output_value || '';

  return (
    <div className={`w-72 rounded-xl border p-4 bg-slate-900/90 backdrop-blur-md shadow-xl transition-all ${
      selected ? 'border-cyan-500 ring-2 ring-cyan-500/30' : 'border-slate-800 hover:border-slate-700'
    }`}>
      {/* Input Port Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!bg-indigo-400 !w-3 !h-3 !border-2 !border-slate-950"
      />

      {/* Node Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Send className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-slate-100">{data.label || 'Output Node'}</span>
        </div>
        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
          Output
        </span>
      </div>

      {/* Output Content Display */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-[11px] font-medium text-slate-400">Result Display</label>
          {outputText && (
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Ready
            </span>
          )}
        </div>
        <div className="text-xs text-slate-200 bg-slate-950 p-2.5 rounded border border-slate-800 line-clamp-4 min-h-[56px] leading-relaxed overflow-y-auto max-h-32">
          {outputText || <span className="text-slate-600 italic">Output will be displayed here after running graph...</span>}
        </div>
      </div>
    </div>
  );
}
