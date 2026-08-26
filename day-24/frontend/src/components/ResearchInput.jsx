import React, { useState } from 'react';
import { Search, Sparkles, Sliders, Filter, ArrowRight } from 'lucide-react';

const PRESET_AGENTS = "How are AI coding agents changing software development in 2026?";
const PRESET_RAG = "What are the latest developments in RAG vs Vector Databases in 2026?";
const PRESET_FRAMEWORKS = "Compare CrewAI, AutoGen, Mastra, and PydanticAI frameworks for production multi-agent systems.";

export default function ResearchInput({ onResearch, loading }) {
  const [question, setQuestion] = useState(PRESET_AGENTS);
  const [depth, setDepth] = useState('standard');
  const [sourceFilter, setSourceFilter] = useState('');

  const handlePreset = (type) => {
    if (type === 'agents') {
      setQuestion(PRESET_AGENTS);
      setDepth('deep');
      setSourceFilter('');
    } else if (type === 'rag') {
      setQuestion(PRESET_RAG);
      setDepth('standard');
      setSourceFilter('arxiv.org');
    } else if (type === 'frameworks') {
      setQuestion(PRESET_FRAMEWORKS);
      setDepth('deep');
      setSourceFilter('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question.trim()) return;
    onResearch({ question, depth, source_filter: sourceFilter || null });
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
      
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Step 1: Define Research Topic</span>
          <h2 className="text-lg font-bold text-white">Research Question & Scope</h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium">Presets:</span>
          <button
            type="button"
            onClick={() => handlePreset('agents')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all"
          >
            🤖 AI Coding Agents
          </button>
          <button
            type="button"
            onClick={() => handlePreset('rag')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
          >
            📄 RAG vs Vector DBs
          </button>
          <button
            type="button"
            onClick={() => handlePreset('frameworks')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition-all"
          >
            ⚡ Framework Comparison
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Research Question Textarea */}
        <div>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            placeholder="Enter research topic or question to investigate e.g., 'How are AI coding agents changing software development?'..."
            className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 focus:outline-none focus:border-cyan-500 placeholder-slate-600 leading-relaxed resize-y font-medium"
          />
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Depth Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              Research Depth:
            </label>
            <div className="flex gap-2">
              {['quick', 'standard', 'deep'].map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDepth(d)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
                    depth === d
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Domain Filter */}
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
              <Filter className="w-3.5 h-3.5 text-blue-400" />
              Optional Domain Filter:
            </label>
            <input
              type="text"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              placeholder="e.g. arxiv.org, openai.com"
              className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500 placeholder-slate-600 font-mono"
            />
          </div>

        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              Executing Multi-Query Search & Evidence Synthesis...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Run AI Research Assistant
            </>
          )}
        </button>

      </form>

    </div>
  );
}
