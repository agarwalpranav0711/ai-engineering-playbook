import React from 'react';
import { Sliders, Trash2, Tag, FileText, Cpu, Flame, ShieldAlert, Sparkles } from 'lucide-react';

export default function SettingsPanel({ selectedNode, onUpdateNodeData, onDeleteNode }) {
  if (!selectedNode) {
    return (
      <aside className="w-80 border-l border-slate-800 bg-slate-950/60 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center z-10 shrink-0 select-none">
        <div className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-500 mb-3">
          <Sliders className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-300 mb-1">No Node Selected</h3>
        <p className="text-xs text-slate-500 max-w-[200px]">
          Click any node on the canvas to configure its settings, prompt template, or AI parameters.
        </p>
      </aside>
    );
  }

  const { id, type, data } = selectedNode;

  return (
    <aside className="w-80 border-l border-slate-800 bg-slate-950/80 backdrop-blur-md p-5 flex flex-col z-10 shrink-0 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Node Settings</h3>
          <p className="text-[11px] text-slate-400 font-mono">ID: {id}</p>
        </div>
        <button
          onClick={() => onDeleteNode(id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
          title="Delete Node"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* General Settings */}
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-300 block mb-1">
            Node Title
          </label>
          <input
            type="text"
            value={data.label || ''}
            onChange={(e) => onUpdateNodeData(id, { label: e.target.value })}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
            placeholder="Custom title..."
          />
        </div>

        {/* INPUT NODE SETTINGS */}
        {type === 'input' && (
          <>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-emerald-400" /> Variable Key Name
              </label>
              <input
                type="text"
                value={data.name || ''}
                onChange={(e) => onUpdateNodeData(id, { name: e.target.value })}
                className="w-full font-mono bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-emerald-300 focus:outline-none focus:border-emerald-500 transition"
                placeholder="e.g. topic, text, message"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Referenced in Prompt Nodes as &#123;&#123;{data.name || 'variable'}&#125;&#125;
              </span>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Input Value
              </label>
              <textarea
                rows={4}
                value={data.value || ''}
                onChange={(e) => onUpdateNodeData(id, { value: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 transition leading-relaxed resize-none"
                placeholder="Enter input content..."
              />
            </div>
          </>
        )}

        {/* PROMPT NODE SETTINGS */}
        {type === 'prompt' && (
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-amber-400" /> Prompt Template
            </label>
            <textarea
              rows={6}
              value={data.template || ''}
              onChange={(e) => onUpdateNodeData(id, { template: e.target.value })}
              className="w-full font-mono bg-slate-900 border border-slate-800 rounded-lg p-3 text-xs text-amber-200 focus:outline-none focus:border-amber-500 transition leading-relaxed resize-none"
              placeholder="e.g. Summarize the following {{topic}}:"
            />
            <div className="mt-2 p-2 rounded bg-amber-500/5 border border-amber-500/10 text-[11px] text-amber-300">
              💡 Use <code className="font-mono text-amber-200">&#123;&#123;variable&#125;&#125;</code> to dynamically inject values from previous Input nodes.
            </div>
          </div>
        )}

        {/* AI NODE SETTINGS */}
        {type === 'ai' && (
          <>
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Model Provider
              </label>
              <select
                value={data.model || 'openai/gpt-4o-mini'}
                onChange={(e) => onUpdateNodeData(id, { model: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-indigo-300 focus:outline-none focus:border-indigo-500 transition font-mono cursor-pointer"
              >
                <option value="openai/gpt-4o-mini">OpenAI (gpt-4o-mini)</option>
                <option value="anthropic/claude-3.5-sonnet">Anthropic (claude-3.5-sonnet)</option>
                <option value="google/gemini-2.5-flash">Google (gemini-2.5-flash)</option>
                <option value="meta-llama/llama-3.1-70b-instruct">Meta (llama-3.1-70b)</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-400" /> Temperature
                </label>
                <span className="font-mono text-xs text-orange-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {data.temperature !== undefined ? data.temperature : 0.7}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={data.temperature !== undefined ? data.temperature : 0.7}
                onChange={(e) => onUpdateNodeData(id, { temperature: parseFloat(e.target.value) })}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0.0 (Deterministic)</span>
                <span>1.0 (Creative)</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                System Prompt (Instructions)
              </label>
              <textarea
                rows={3}
                value={data.system_prompt || ''}
                onChange={(e) => onUpdateNodeData(id, { system_prompt: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition leading-relaxed resize-none"
                placeholder="You are a helpful AI assistant..."
              />
            </div>
          </>
        )}

        {/* OUTPUT NODE SETTINGS */}
        {type === 'output' && (
          <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10 text-cyan-300 text-xs leading-relaxed">
            <Sparkles className="w-4 h-4 text-cyan-400 mb-1" />
            <span className="font-semibold block">Output Terminal</span>
            This node receives execution responses from connected AI nodes and renders the final result.
          </div>
        )}
      </div>
    </aside>
  );
}
