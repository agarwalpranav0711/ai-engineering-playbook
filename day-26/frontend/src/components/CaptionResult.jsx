import React, { useState } from 'react';
import { Eye, BookOpen, Layers, Palette, EyeOff, MessageSquare, Copy, Check, Download, RefreshCw, Sparkles, Send, Clock } from 'lucide-react';

export default function CaptionResult({ analysis, processingTime, file, onAskQuestion, onRegenerate, loading }) {
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedAlt, setCopiedAlt] = useState(false);
  const [userQuestion, setUserQuestion] = useState('');
  const [qaAnswer, setQaAnswer] = useState(null);
  const [qaLoading, setQaLoading] = useState(false);

  if (!analysis) return null;

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(analysis.caption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleCopyAlt = () => {
    navigator.clipboard.writeText(analysis.alt_text);
    setCopiedAlt(true);
    setTimeout(() => setCopiedAlt(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const markdownContent = formatAnalysisAsMarkdown(analysis);
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `caption_${(file?.name || 'image').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleQaSubmit = async (e) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;
    setQaLoading(true);
    setQaAnswer(null);
    try {
      const answer = await onAskQuestion(userQuestion);
      setQaAnswer(answer);
    } catch (err) {
      console.error(err);
      setQaAnswer("Failed to answer visual question.");
    } finally {
      setQaLoading(false);
    }
  };

  const formatAnalysisAsMarkdown = (a) => {
    let md = `# Image Caption Analysis\n\n`;
    md += `## ✨ Concise Caption\n${a.caption}\n\n`;
    md += `## 📖 Detailed Visual Description\n${a.detailed_description}\n\n`;
    
    if (a.objects && a.objects.length > 0) {
      md += `## 🔎 Main Visible Objects\n`;
      a.objects.forEach(obj => md += `- ${obj}\n`);
      md += `\n`;
    }

    md += `## 🏞️ Scene Setting\n${a.scene}\n\n`;

    if (a.colors && a.colors.length > 0) {
      md += `## 🎨 Dominant Colors\n`;
      a.colors.forEach(col => md += `- ${col}\n`);
      md += `\n`;
    }

    if (a.mood) {
      md += `## 🎭 Atmosphere & Mood\n${a.mood}\n\n`;
    }

    md += `## ♿ Accessibility Alt Text\n"${a.alt_text}"\n\n`;

    if (a.visible_text) {
      md += `## 📝 Extracted Visible Text (OCR)\n"${a.visible_text}"\n\n`;
    }

    return md;
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Title & Metadata Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Synthesized Multimodal Report</span>
          <h2 className="text-xl sm:text-2xl font-black text-white">Visual Intelligence Analysis</h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            {processingTime}s
          </span>
        </div>
      </div>

      {/* Concise Caption Banner */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-amber-900/40 via-slate-900 to-orange-900/40 border border-amber-500/20 space-y-2">
        <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          Concise Image Caption
        </h3>
        <p className="text-sm font-bold text-white leading-relaxed font-sans">"{analysis.caption}"</p>
      </div>

      {/* Detailed Description */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          Detailed Visual Description
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">{analysis.detailed_description}</p>
      </div>

      {/* Grid: Objects, Scene & Colors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Visible Objects List */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            Visible Objects ({analysis.objects?.length || 0})
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {analysis.objects?.map((obj, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300">
                • {obj}
              </span>
            ))}
          </div>
        </div>

        {/* Scene Setting */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <h3 className="text-sm font-bold text-orange-400 flex items-center gap-2">
            <Eye className="w-4 h-4 text-orange-400" />
            Scene & Setting
          </h3>
          <span className="px-3 py-1.5 rounded-xl bg-orange-500/10 text-orange-300 border border-orange-500/20 text-xs font-bold inline-block">
            🏞️ {analysis.scene}
          </span>
          {analysis.mood && (
            <p className="text-xs text-slate-400">Atmosphere: <strong className="text-slate-200">{analysis.mood}</strong></p>
          )}
        </div>

        {/* Dominant Colors */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-400" />
            Dominant Colors
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {analysis.colors?.map((col, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-300">
                🎨 {col}
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Accessibility Alt Text Box */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-2 uppercase tracking-wider">
            ♿ Accessibility Screen-Reader Alt Text
          </h3>
          <button
            onClick={handleCopyAlt}
            className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1"
          >
            {copiedAlt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
            {copiedAlt ? 'Copied Alt Text!' : 'Copy Alt'}
          </button>
        </div>
        <p className="text-xs font-mono text-cyan-200 italic">"{analysis.alt_text}"</p>
      </div>

      {/* Extracted OCR Text if present */}
      {analysis.visible_text && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <h3 className="text-xs font-bold text-amber-400 flex items-center gap-2 uppercase tracking-wider">
            📝 Extracted Visible Text (OCR)
          </h3>
          <p className="text-xs font-mono text-amber-200 whitespace-pre-wrap">"{analysis.visible_text}"</p>
        </div>
      )}

      {/* Visual Q&A Section */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-amber-400" />
          Ask a Question About This Image
        </h3>

        <form onSubmit={handleQaSubmit} className="flex gap-2">
          <input
            type="text"
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            placeholder="Ask AI e.g. 'What color is the mug?' or 'How many people are present?'..."
            className="flex-1 bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 placeholder-slate-600 font-medium"
          />
          <button
            type="submit"
            disabled={qaLoading || !userQuestion.trim()}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all disabled:opacity-40 flex items-center gap-1.5 shrink-0"
          >
            {qaLoading ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Ask AI
          </button>
        </form>

        {qaAnswer && (
          <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/30 text-xs text-amber-200 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 block">💬 Visual Q&A Answer:</span>
            <p className="font-sans font-medium">{qaAnswer}</p>
          </div>
        )}
      </div>

      {/* Action Buttons Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleCopyCaption}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 hover:from-amber-400 hover:to-red-500 text-white text-xs font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
          >
            {copiedCaption ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedCaption ? 'Copied Caption!' : 'Copy Caption'}
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4 text-amber-400" />
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
