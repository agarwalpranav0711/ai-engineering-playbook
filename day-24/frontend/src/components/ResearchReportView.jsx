import React, { useState } from 'react';
import { BookOpen, Scale, AlertTriangle, ExternalLink, Copy, Check, Download, RefreshCw, Clock, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ResearchReportView({ report, searchQueries, processingTime, onRegenerate, loading }) {
  const [copied, setCopied] = useState(false);

  if (!report) return null;

  const handleCopyReport = () => {
    const markdownContent = formatReportAsMarkdown(report);
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const markdownContent = formatReportAsMarkdown(report);
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `research_${report.question.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase().slice(0, 30)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatReportAsMarkdown = (r) => {
    let md = `# Research Report: ${r.question}\n\n`;
    md += `**Confidence Level**: ${r.confidence_level}\n\n`;
    md += `## 📌 Executive Summary\n${r.executive_summary}\n\n`;
    
    if (r.key_findings && r.key_findings.length > 0) {
      md += `## 🔍 Key Findings & Evidence\n`;
      r.key_findings.forEach((f, idx) => {
        const citations = f.source_ids ? f.source_ids.map(id => `[${id}]`).join('') : '';
        md += `${idx + 1}. **${f.claim}** ${citations}\n   - *Evidence*: "${f.evidence}"\n\n`;
      });
    }

    if (r.contradictions && r.contradictions.length > 0) {
      md += `## ⚖️ Conflicting Evidence & Contradictions\n`;
      r.contradictions.forEach(c => md += `- ${c}\n`);
      md += `\n`;
    }

    if (r.limitations && r.limitations.length > 0) {
      md += `## ⚠️ Research Scope & Limitations\n`;
      r.limitations.forEach(l => md += `- ${l}\n`);
      md += `\n`;
    }

    md += `## 🎯 Conclusion\n${r.conclusion}\n\n`;

    if (r.sources && r.sources.length > 0) {
      md += `## 📚 Bibliography & Cited Sources\n`;
      r.sources.forEach(s => {
        md += `[${s.id}] **${s.title}** (${s.domain})\n   - URL: ${s.url}\n   - Snippet: "${s.snippet}"\n\n`;
      });
    }

    return md;
  };

  const getConfidenceBadge = (level) => {
    const l = level?.toLowerCase() || 'medium';
    if (l === 'high') return <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">High Confidence</span>;
    if (l === 'medium') return <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">Medium Confidence</span>;
    return <span className="px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold">Low Confidence</span>;
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Title & Metadata Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Synthesized Research Report</span>
          <h2 className="text-xl sm:text-2xl font-black text-white">{report.question}</h2>
        </div>

        <div className="flex items-center gap-2">
          {getConfidenceBadge(report.confidence_level)}
          <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            {processingTime}s
          </span>
        </div>
      </div>

      {/* Generated Search Queries Chip Bar */}
      {searchQueries && searchQueries.length > 0 && (
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 block">Sub-Queries Executed by Planner:</span>
          <div className="flex flex-wrap gap-2">
            {searchQueries.map((q, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300">
                🔎 {q}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Executive Summary Banner */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-cyan-900/40 via-slate-900 to-blue-900/40 border border-cyan-500/20 space-y-2">
        <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          Executive Summary
        </h3>
        <p className="text-xs text-slate-200 leading-relaxed font-sans">{report.executive_summary}</p>
      </div>

      {/* Key Findings Card with Citations */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          Key Findings & Grounded Evidence ({report.key_findings?.length || 0})
        </h3>

        <div className="space-y-3">
          {report.key_findings?.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold text-cyan-400 mt-0.5">{idx + 1}.</span>
                  <h4 className="text-xs font-bold text-slate-100">{item.claim}</h4>
                </div>
                
                {/* Citation Pills */}
                <div className="flex items-center gap-1 shrink-0">
                  {item.source_ids?.map((sid) => (
                    <a
                      key={sid}
                      href={`#source-${sid}`}
                      className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30 text-[11px] font-mono font-bold transition-all"
                    >
                      [{sid}]
                    </a>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800/80 text-xs text-slate-300 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 block">💬 Direct Evidence Quote:</span>
                <p className="italic font-mono text-slate-300">"{item.evidence}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Contradictions & Limitations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Contradictions */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
            <Scale className="w-4 h-4 text-purple-400" />
            Conflicting Evidence & Disagreements
          </h3>

          <ul className="space-y-2">
            {report.contradictions && report.contradictions.length > 0 ? (
              report.contradictions.map((item, idx) => (
                <li key={idx} className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/15 text-xs text-purple-200 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No major contradictions detected across sources.</p>
            )}
          </ul>
        </div>

        {/* Limitations */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Research Scope & Limitations
          </h3>

          <ul className="space-y-2">
            {report.limitations && report.limitations.length > 0 ? (
              report.limitations.map((item, idx) => (
                <li key={idx} className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/15 text-xs text-amber-200 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">Standard research limitations apply.</p>
            )}
          </ul>
        </div>

      </div>

      {/* Conclusion */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
        <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Research Conclusion
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">{report.conclusion}</p>
      </div>

      {/* Bibliography / Sources Cards */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          Bibliography & Verified Cited Sources ({report.sources?.length || 0})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.sources?.map((s) => (
            <div id={`source-${s.id}`} key={s.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-mono font-bold">
                    [{s.id}]
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">{s.domain}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-100">{s.title}</h4>
                <p className="text-[11px] text-slate-400 italic line-clamp-3">"{s.snippet}"</p>
              </div>

              <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 capitalize">{s.source_type || 'web'}</span>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-all"
                >
                  Visit Source <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleCopyReport}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied Full Report!' : 'Copy Full Report'}
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4 text-cyan-400" />
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
