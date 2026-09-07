import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { MessageSquareCode } from 'lucide-react';

export default function PromptNode({ id, data, selected }) {
  const template = data.template || '';

  return (
    <div className={`w-72 rounded-xl border p-4 bg-slate-900/90 backdrop-blur-md shadow-xl transition-all ${
      selected ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-slate-800 hover:border-slate-700'
    }`}>
      {/* Input Port Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!bg-emerald-400 !w-3 !h-3 !border-2 !border-slate-950"
      />

      {/* Node Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <MessageSquareCode className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-slate-100">{data.label || 'Prompt Node'}</span>
        </div>
        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
          Prompt
        </span>
      </div>

      {/* Template Preview */}
      <div>
        <label className="text-[11px] font-medium text-slate-400 block mb-1">
          Prompt Template
        </label>
        <div className="font-mono text-xs text-amber-200 bg-slate-950 p-2.5 rounded border border-slate-800 line-clamp-3 min-h-[48px] leading-relaxed">
          {template || <span className="text-slate-600 italic">Enter template with &#123;&#123;variable&#125;&#125;...</span>}
        </div>
      </div>

      {/* Output Port Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!bg-amber-400 !w-3 !h-3 !border-2 !border-slate-950"
      />
    </div>
  );
}
