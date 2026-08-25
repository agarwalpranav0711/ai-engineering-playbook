import React, { useState } from 'react';
import { Target, CheckSquare, AlertTriangle, HelpCircle, Users, Copy, Check, Download, RefreshCw, Clock, Layers, Sparkles } from 'lucide-react';

export default function SummaryDashboard({ summary, strategyUsed, processingTime, onRegenerate, loading }) {
  const [copied, setCopied] = useState(false);

  if (!summary) return null;

  const handleCopySummary = () => {
    const fullText = formatSummaryAsMarkdown(summary);
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const markdownContent = formatSummaryAsMarkdown(summary);
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${summary.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_summary.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatSummaryAsMarkdown = (s) => {
    let md = `# ${s.title}\n\n`;
    md += `## 📌 Executive Summary\n${s.executive_summary}\n\n`;
    
    if (s.decisions && s.decisions.length > 0) {
      md += `## 🎯 Confirmed Decisions\n`;
      s.decisions.forEach(d => {
        md += `- **${d.decision}**${d.context ? ` (${d.context})` : ''}\n`;
      });
      md += `\n`;
    }

    if (s.action_items && s.action_items.length > 0) {
      md += `## ✅ Action Items\n`;
      s.action_items.forEach(a => {
        md += `- [ ] **${a.task}** | Assignee: ${a.assignee || 'Unassigned'} | Deadline: ${a.deadline || 'Not specified'}\n`;
      });
      md += `\n`;
    }

    if (s.risks && s.risks.length > 0) {
      md += `## ⚠️ Risks & Blockers\n`;
      s.risks.forEach(r => md += `- ${r}\n`);
      md += `\n`;
    }

    if (s.key_points && s.key_points.length > 0) {
      md += `## 📌 Key Points\n`;
      s.key_points.forEach(k => md += `- ${k}\n`);
      md += `\n`;
    }

    if (s.open_questions && s.open_questions.length > 0) {
      md += `## ❓ Open Questions\n`;
      s.open_questions.forEach(q => md += `- ${q}\n`);
      md += `\n`;
    }

    if (s.participants && s.participants.length > 0) {
      md += `## 👥 Participants\n`;
      s.participants.forEach(p => md += `- ${p}\n`);
      md += `\n`;
    }

    return md;
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Title & Strategy Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Structured Intelligence Report</span>
          <h2 className="text-2xl font-black text-white">{summary.title}</h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            {strategyUsed === 'hierarchical_map_reduce' ? 'Map-Reduce Chunker' : 'Direct LLM Pass'}
          </span>

          <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-pink-400" />
            {processingTime}s
          </span>
        </div>
      </div>

      {/* Executive Summary Banner */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-purple-900/40 via-slate-900 to-indigo-900/40 border border-purple-500/20 space-y-2">
        <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          Executive Summary
        </h3>
        <p className="text-xs text-slate-200 leading-relaxed font-sans">{summary.executive_summary}</p>
      </div>

      {/* Grid 1: Decisions & Action Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Confirmed Decisions */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            Confirmed Agreed Decisions ({summary.decisions?.length || 0})
          </h3>

          {summary.decisions && summary.decisions.length > 0 ? (
            <div className="space-y-2">
              {summary.decisions.map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/15 text-xs space-y-1">
                  <div className="font-semibold text-emerald-200 flex items-start gap-1.5">
                    <span className="text-emerald-400">✓</span>
                    <span>{item.decision}</span>
                  </div>
                  {item.context && <p className="text-[11px] text-slate-400 italic pl-4">{item.context}</p>}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No explicit confirmed decisions flagged.</p>
          )}
        </div>

        {/* Action Items Table */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-indigo-400" />
            Action Items & Task Ownership ({summary.action_items?.length || 0})
          </h3>

          {summary.action_items && summary.action_items.length > 0 ? (
            <div className="space-y-2">
              {summary.action_items.map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                  <span className="font-semibold text-slate-200 block">{item.task}</span>
                  <div className="flex items-center gap-2 flex-wrap text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                      👤 {item.assignee || 'Unassigned'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                      📅 {item.deadline || 'Not specified'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium uppercase text-[10px]">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No assigned action items extracted.</p>
          )}
        </div>

      </div>

      {/* Grid 2: Risks & Open Questions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Risks & Blockers */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Risks & Blockers ({summary.risks?.length || 0})
          </h3>

          <ul className="space-y-2">
            {summary.risks && summary.risks.length > 0 ? (
              summary.risks.map((item, idx) => (
                <li key={idx} className="p-2.5 rounded-lg bg-rose-500/5 border border-rose-500/15 text-xs text-rose-200 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No active risks or blockers flagged.</p>
            )}
          </ul>
        </div>

        {/* Open Questions */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            Open Questions & Unresolved Items ({summary.open_questions?.length || 0})
          </h3>

          <ul className="space-y-2">
            {summary.open_questions && summary.open_questions.length > 0 ? (
              summary.open_questions.map((item, idx) => (
                <li key={idx} className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/15 text-xs text-amber-200 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No open questions remaining.</p>
            )}
          </ul>
        </div>

      </div>

      {/* Grid 3: Key Points & Participants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Key Points & Topics */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-purple-300">📌 Key Points & Topics</h3>
          <div className="space-y-2">
            {summary.key_points?.map((kp, idx) => (
              <p key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-purple-400 font-bold">•</span>
                <span>{kp}</span>
              </p>
            ))}
          </div>
        </div>

        {/* Participants List */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" />
            Participants Present ({summary.participants?.length || 0})
          </h3>

          <div className="flex flex-wrap gap-2">
            {summary.participants?.map((p, idx) => (
              <span key={idx} className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300">
                👤 {p}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Action Buttons Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleCopySummary}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white text-xs font-bold shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Full Summary!' : 'Copy Full Summary'}
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4 text-pink-400" />
            Download (.md)
          </button>
        </div>

        <button
          onClick={onRegenerate}
          disabled={loading}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Regenerate
        </button>
      </div>

    </div>
  );
}
