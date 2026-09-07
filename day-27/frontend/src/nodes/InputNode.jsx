import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileInput, Tag } from 'lucide-react';

export default function InputNode({ id, data, selected }) {
  const variableName = data.name || 'topic';
  const variableValue = data.value || '';

  return (
    <div className={`w-64 rounded-xl border p-4 bg-slate-900/90 backdrop-blur-md shadow-xl transition-all ${
      selected ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-slate-800 hover:border-slate-700'
    }`}>
      {/* Node Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <FileInput className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-slate-100">{data.label || 'Input Node'}</span>
        </div>
        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Input
        </span>
      </div>

      {/* Node Content */}
      <div className="space-y-2.5">
        <div>
          <label className="text-[11px] font-medium text-slate-400 block mb-1 flex items-center gap-1">
            <Tag className="w-3 h-3 text-emerald-400" /> Variable Name
          </label>
          <div className="font-mono text-xs text-emerald-300 bg-slate-950 px-2 py-1 rounded border border-slate-800 truncate">
            {`{{${variableName}}}`}
          </div>
        </div>

        <div>
          <label className="text-[11px] font-medium text-slate-400 block mb-1">
            Initial Value
          </label>
          <div className="text-xs text-slate-300 bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800 line-clamp-2 min-h-[32px]">
            {variableValue || <span className="text-slate-600 italic">Empty value...</span>}
          </div>
        </div>
      </div>

      {/* Output Port Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!bg-emerald-400 !w-3 !h-3 !border-2 !border-slate-950"
      />
    </div>
  );
}
