import React, { useState } from 'react';
import { Copy, Check, RefreshCw, Sparkles, Clock, FileText, CheckCircle2, MessageSquareText } from 'lucide-react';

export default function EmailDisplay({ email, processingTime, onRewrite, onRegenerate, rewriteLoading }) {
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedFull, setCopiedFull] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(email?.subject || '');

  if (!email) return null;

  const currentSubject = selectedSubject || email.subject;

  const handleCopySubject = () => {
    navigator.clipboard.writeText(currentSubject);
    setCopiedSubject(true);
    setTimeout(() => setCopiedSubject(false), 2000);
  };

  const handleCopyFullEmail = () => {
    const fullText = `Subject: ${currentSubject}\n\n${email.full_email}`;
    navigator.clipboard.writeText(fullText);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2000);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Generated Email Draft</h2>
            <p className="text-xs text-slate-400">Strictly grounded on supplied facts</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono flex items-center gap-1">
            <FileText className="w-3 h-3 text-indigo-400" />
            {email.word_count} words
          </span>

          <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono flex items-center gap-1">
            <Clock className="w-3 h-3 text-purple-400" />
            {processingTime}s
          </span>
        </div>
      </div>

      {/* Subject Line Card */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Subject Line</span>
          <button
            onClick={handleCopySubject}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-all flex items-center gap-1"
          >
            {copiedSubject ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copiedSubject ? 'Copied' : 'Copy Subject'}
          </button>
        </div>

        <h3 className="text-base font-bold text-indigo-300 font-mono">{currentSubject}</h3>

        {/* Alternative Subjects */}
        {email.alternative_subjects && email.alternative_subjects.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
            <span className="text-[11px] text-slate-500 font-semibold block">Alternative Subjects:</span>
            <div className="flex flex-wrap gap-2">
              {email.alternative_subjects.map((alt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedSubject(alt)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                    currentSubject === alt
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {alt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Email Body Preview Card */}
      <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 font-sans text-sm text-slate-200 leading-relaxed space-y-4 shadow-inner">
        <div className="whitespace-pre-line text-slate-100 font-medium">
          {email.full_email}
        </div>
      </div>

      {/* Primary Action Button: Copy Full Email */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800">
        
        <button
          onClick={handleCopyFullEmail}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
        >
          {copiedFull ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copiedFull ? 'Full Email Copied to Clipboard!' : 'Copy Full Email'}
        </button>

        <button
          onClick={onRegenerate}
          disabled={rewriteLoading}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${rewriteLoading ? 'animate-spin' : ''}`} />
          Regenerate
        </button>

      </div>

      {/* Controlled Rewriting Action Toolbar */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquareText className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Refine & Rewrite Email</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onRewrite('make_professional')}
            disabled={rewriteLoading}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
          >
            👔 Make Professional
          </button>

          <button
            type="button"
            onClick={() => onRewrite('make_friendly')}
            disabled={rewriteLoading}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition-all"
          >
            😊 Make Friendly
          </button>

          <button
            type="button"
            onClick={() => onRewrite('make_concise')}
            disabled={rewriteLoading}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-pink-500/10 text-pink-300 border border-pink-500/20 hover:bg-pink-500/20 transition-all"
          >
            ⚡ Make Concise
          </button>

          <button
            type="button"
            onClick={() => onRewrite('make_detailed')}
            disabled={rewriteLoading}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
          >
            📖 Make Detailed
          </button>

          <button
            type="button"
            onClick={() => onRewrite('fix_grammar')}
            disabled={rewriteLoading}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
          >
            ✍️ Fix Grammar
          </button>
        </div>
      </div>

    </div>
  );
}
