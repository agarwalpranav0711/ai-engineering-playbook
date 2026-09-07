import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Cpu, Flame } from 'lucide-react';

export default function AINode({ id, data, selected }) {
  const model = data.model || 'openai/gpt-4o-mini';
  const temperature = data.temperature !== undefined ? data.temperature : 0.7;

  return (
    <div className={`w-72 rounded-xl border p-4 bg-slate-900/90 backdrop-blur-md shadow-xl transition-all ${
      selected ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-slate-800 hover:border-slate-700'
    }`}>
      {/* Input Port Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!bg-amber-400 !w-3 !h-3 !border-2 !border-slate-950"
      />

      {/* Node Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Cpu className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-slate-100">{data.label || 'AI Model'}</span>
        </div>
        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          AI
        </span>
      </div>

      {/* Node Details */}
      <div className="space-y-2">
        <div>
          <label className="text-[11px] font-medium text-slate-400 block mb-1">
            Model Provider
          </label>
          <div className="font-mono text-xs text-indigo-300 bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800 truncate">
            {model}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-slate-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-400" /> Temp
          </span>
          <span className="font-mono text-slate-200 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            {temperature}
          </span>
        </div>
      </div>

      {/* Output Port Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!bg-indigo-400 !w-3 !h-3 !border-2 !border-slate-950"
      />
    </div>
  );
}
