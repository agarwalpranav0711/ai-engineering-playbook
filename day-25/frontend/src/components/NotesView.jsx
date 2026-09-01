import React, { useState } from 'react';
import { Target, CheckSquare, Users, Clock, HelpCircle, Copy, Check, Download, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

export default function NotesView({ notes, processingTime, onRegenerate, loading }) {
  const [copied, setCopied] = useState(false);

  if (!notes) return null;

  const handleCopyNotes = () => {
    const markdownContent = formatNotesAsMarkdown(notes);
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const markdownContent = formatNotesAsMarkdown(notes);
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${notes.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}_notes.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatNotesAsMarkdown = (n) => {
    let md = `# 📝 ${n.title}\n\n`;
    md += `## 📌 Executive Summary\n${n.summary}\n\n`;

    if (n.key_points && n.key_points.length > 0) {
      md += `## 🔑 Key Points\n`;
      n.key_points.forEach(k => md += `- ${k}\n`);
      md += `\n`;
    }

    if (n.tasks && n.tasks.length > 0) {
      md += `## ✅ Action Items Checklist\n`;
      n.tasks.forEach(t => {
        md += `- [ ] **${t.task}** | Assignee: ${t.assignee || 'Unassigned'} | Deadline: ${t.deadline || 'Not specified'}\n`;
      });
      md += `\n`;
    }

    if (n.decisions && n.decisions.length > 0) {
      md += `## 🎯 Confirmed Decisions\n`;
      n.decisions.forEach(d => md += `- ${d}\n`);
      md += `\n`;
    }

    if (n.deadlines && n.deadlines.length > 0) {
      md += `## 📅 Target Deadlines\n`;
      n.deadlines.forEach(dl => md += `- ${dl}\n`);
      md += `\n`;
    }

    if (n.people && n.people.length > 0) {
      md += `## 👥 People Mentioned\n`;
      n.people.forEach(p => md += `- ${p}\n`);
      md += `\n`;
    }

    if (n.questions && n.questions.length > 0) {
      md += `## ❓ Open Questions & Next Steps\n`;
      n.questions.forEach(q => md += `- ${q}\n`);
      md += `\n`;
    }

    return md;
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Title & Metadata Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Synthesized AI Voice Notes</span>
          <h2 className="text-2xl font-black text-white">{notes.title}</h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-rose-400" />
            {processingTime}s
          </span>
        </div>
      </div>

      {/* Executive Summary Banner */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-rose-900/40 via-slate-900 to-purple-900/40 border border-rose-500/20 space-y-2">
        <h3 className="text-sm font-bold text-rose-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-rose-400" />
          Executive Summary
        </h3>
        <p className="text-xs text-slate-200 leading-relaxed font-sans">{notes.summary}</p>
      </div>

      {/* Key Points & Action Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Key Points */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-rose-300">🔑 Key Takeaways ({notes.key_points?.length || 0})</h3>
          <div className="space-y-2">
            {notes.key_points?.map((kp, idx) => (
              <p key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>{kp}</span>
              </p>
            ))}
          </div>
        </div>

        {/* Action Items Checklist */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-emerald-400" />
            Action Items Checklist ({notes.tasks?.length || 0})
          </h3>

          {notes.tasks && notes.tasks.length > 0 ? (
            <div className="space-y-2">
              {notes.tasks.map((t, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                  <span className="font-semibold text-slate-200 block">□ {t.task}</span>
                  <div className="flex items-center gap-2 flex-wrap text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                      👤 {t.assignee || 'Unassigned'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium">
                      📅 {t.deadline || 'Not specified'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No action items extracted.</p>
          )}
        </div>

      </div>

      {/* Grid: Deadlines, People & Questions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Deadlines */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-rose-400 flex items-center gap-2">
            <Clock className="w-4 h-4 text-rose-400" />
            Deadlines Mentioned
          </h3>
          <ul className="space-y-2">
            {notes.deadlines && notes.deadlines.length > 0 ? (
              notes.deadlines.map((dl, idx) => (
                <li key={idx} className="p-2 rounded-lg bg-rose-500/5 border border-rose-500/15 text-xs text-rose-200">
                  📅 {dl}
                </li>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No specific deadlines.</p>
            )}
          </ul>
        </div>

        {/* People */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            People Mentioned
          </h3>
          <div className="flex flex-wrap gap-2">
            {notes.people && notes.people.length > 0 ? (
              notes.people.map((p, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300">
                  👤 {p}
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No specific names.</p>
            )}
          </div>
        </div>

        {/* Open Questions */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            Open Questions
          </h3>
          <ul className="space-y-2">
            {notes.questions && notes.questions.length > 0 ? (
              notes.questions.map((q, idx) => (
                <li key={idx} className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/15 text-xs text-amber-200">
                  ❓ {q}
                </li>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No unresolved questions.</p>
            )}
          </ul>
        </div>

      </div>

      {/* Action Buttons Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleCopyNotes}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Voice Notes!' : 'Copy Full Notes'}
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4 text-rose-400" />
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
