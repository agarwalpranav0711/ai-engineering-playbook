import React from 'react';
import { Search, Compass, BookOpen, Scale, Sparkles, CheckCircle2 } from 'lucide-react';

const STAGES = [
  { id: 1, name: 'Query Planning', desc: 'Decomposing question into sub-queries', icon: Compass },
  { id: 2, name: 'Multi-Query Web Search', desc: 'Searching web & retrieving source metadata', icon: Search },
  { id: 3, name: 'Evidence Extraction', desc: 'Reading snippets & mapping claims', icon: BookOpen },
  { id: 4, name: 'Cross-Source Check', desc: 'Detecting contradictions & limitations', icon: Scale },
  { id: 5, name: 'Citation Synthesis', desc: 'Finalizing grounded report with [1][2] tags', icon: Sparkles },
];

export default function ResearchProgress({ loading }) {
  if (!loading) return null;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
        <h3 className="text-sm font-bold text-white">AI Research Pipeline Active</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
        {STAGES.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.id} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-bold flex items-center justify-center">
                  {s.id}
                </span>
                <Icon className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">{s.name}</span>
                <span className="text-[10px] text-slate-400 block leading-tight">{s.desc}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
