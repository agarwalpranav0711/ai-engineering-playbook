import React, { useState, useEffect } from 'react';
import { FileText, Edit3, RefreshCw, Sparkles, Copy, Check } from 'lucide-react';

export default function TranscriptView({ initialTranscript, onRegenerateFromTranscript, loading }) {
  const [transcript, setTranscript] = useState(initialTranscript || '');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTranscript(initialTranscript || '');
  }, [initialTranscript]);

  if (!initialTranscript) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    if (transcript.trim()) {
      onRegenerateFromTranscript(transcript);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4 animate-in fade-in duration-400">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-rose-400" />
          <h3 className="text-sm font-bold text-white">Transcribed Speech Dialogue</h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center gap-1"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
            {copied ? 'Copied' : 'Copy Text'}
          </button>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-all flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3 text-rose-400" />
            {isEditing ? 'Done Editing' : 'Edit Transcript'}
          </button>
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          rows={4}
          className="w-full bg-slate-950 border border-rose-500/40 text-xs text-slate-200 rounded-xl p-3 focus:outline-none placeholder-slate-600 font-mono leading-relaxed resize-y"
        />
      ) : (
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-200 leading-relaxed italic">
          "{transcript}"
        </div>
      )}

      {isEditing && (
        <button
          type="button"
          onClick={handleRegenerate}
          disabled={loading || !transcript.trim()}
          className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500 text-xs font-bold text-rose-300 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {loading ? <Sparkles className="w-3.5 h-3.5 animate-spin text-rose-400" /> : <RefreshCw className="w-3.5 h-3.5 text-rose-400" />}
          Regenerate AI Notes from Edited Transcript
        </button>
      )}
    </div>
  );
}
