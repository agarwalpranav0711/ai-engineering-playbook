import React from 'react';
import { FileInput, MessageSquareCode, Cpu, Send, Plus, Info } from 'lucide-react';

const NODE_TYPES = [
  {
    type: 'input',
    label: 'Input Node',
    description: 'Defines input variables (e.g., topic, text, context)',
    icon: FileInput,
    color: 'emerald',
    borderColor: 'border-emerald-500/30',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
  },
  {
    type: 'prompt',
    label: 'Prompt Node',
    description: 'Formats prompts using {{variable}} placeholders',
    icon: MessageSquareCode,
    color: 'amber',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/10',
    textColor: 'text-amber-400',
  },
  {
    type: 'ai',
    label: 'AI Node',
    description: 'Executes OpenRouter LLM inference with system prompt',
    icon: Cpu,
    color: 'indigo',
    borderColor: 'border-indigo-500/30',
    bgColor: 'bg-indigo-500/10',
    textColor: 'text-indigo-400',
  },
  {
    type: 'output',
    label: 'Output Node',
    description: 'Captures and displays the final execution output',
    icon: Send,
    color: 'cyan',
    borderColor: 'border-cyan-500/30',
    bgColor: 'bg-cyan-500/10',
    textColor: 'text-cyan-400',
  },
];

export default function NodePanel({ onAddNode }) {
  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/60 backdrop-blur-md p-4 flex flex-col z-10 shrink-0 select-none">
      <div className="mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between">
          Node Palette
          <span className="text-[10px] font-normal text-slate-500 font-mono">4 Types</span>
        </h2>
        <p className="text-[11px] text-slate-500">Click to add nodes onto the workflow canvas</p>
      </div>

      {/* Node Type List */}
      <div className="space-y-3 overflow-y-auto pr-1">
        {NODE_TYPES.map((nodeDef) => {
          const Icon = nodeDef.icon;
          return (
            <button
              key={nodeDef.type}
              onClick={() => onAddNode(nodeDef.type)}
              className={`w-full text-left p-3 rounded-xl border bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:${nodeDef.borderColor} transition-all duration-200 group relative overflow-hidden`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded-lg ${nodeDef.bgColor} ${nodeDef.textColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-white">
                    {nodeDef.label}
                  </span>
                </div>
                <div className={`p-1 rounded-md bg-slate-800 text-slate-400 group-hover:${nodeDef.bgColor} group-hover:${nodeDef.textColor} transition`}>
                  <Plus className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug pl-7">
                {nodeDef.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Quick Guide Footer */}
      <div className="mt-auto pt-4 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-indigo-300 text-[11px] leading-relaxed flex items-start space-x-2">
          <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">Workflow Graph Tip</span>
            Connect outputs (right ports) to inputs (left ports) to pass data forward sequentially.
          </div>
        </div>
      </div>
    </aside>
  );
}
