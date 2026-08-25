import React, { useState } from 'react';
import { FileText, Sparkles, Sliders, Layers, Play, CheckCircle2 } from 'lucide-react';

const PRESET_PROJECT = `Rahul: Let's discuss the product launch date for the AI Engineering platform.

Pranav: I think we should target launching next Friday. All core backend services and tests are passing.

Kriti: The frontend dashboard is almost complete, but we still need to test authentication and edge cases.

Rahul: Okay. Pranav, can you finish the authentication testing by Wednesday?

Pranav: Yes, I'll do it and update the test runner.

Rahul: Great. So let's confirm the decision: launch is planned for next Friday, assuming authentication testing passes on Wednesday.

Kriti: Also, who will handle the production deployment environment?

Rahul: That's still an open question. We need to assign someone for devops deployment.`;

const PRESET_STANDUP = `Rahul: Welcome to today's daily standup! Pranav, what did you work on yesterday?

Pranav: Yesterday I completed the Day 22 AI Email Writer with tone controls and Pydantic validation. Today I'm working on the Day 23 AI Meeting Summarizer. No blockers on my end.

Kriti: Yesterday I reviewed the React 19 UI components. Today I am optimizing Tailwind CSS v4 styling. Blocker: Waiting for final backend API endpoints to test integration.

Rahul: I'll help test the API endpoints with Kriti by end of day.`;

const PRESET_CLIENT = `Client Representative: We need an automated AI Meeting Summarizer that extracts action items, assigned owners, and key decisions from sales calls.

Rahul: We can build that using FastAPI, Pydantic, and OpenRouter LLMs.

Client Representative: Can it export meeting notes directly as Markdown files?

Pranav: Yes, we can add a one-click Markdown export feature so users can download summary notes instantly.

Client Representative: Excellent. What is the delivery timeline?

Rahul: We will deliver the initial prototype by Friday.`;

export default function TranscriptInput({ onSummarize, loading }) {
  const [meetingType, setMeetingType] = useState('project');
  const [summaryLength, setSummaryLength] = useState('medium');
  const [transcript, setTranscript] = useState(PRESET_PROJECT);

  const handlePreset = (type) => {
    if (type === 'project') {
      setMeetingType('project');
      setTranscript(PRESET_PROJECT);
      setSummaryLength('medium');
    } else if (type === 'standup') {
      setMeetingType('standup');
      setTranscript(PRESET_STANDUP);
      setSummaryLength('short');
    } else if (type === 'client') {
      setMeetingType('client');
      setTranscript(PRESET_CLIENT);
      setSummaryLength('medium');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!transcript.trim()) return;
    onSummarize({ transcript, meeting_type: meetingType, summary_length: summaryLength });
  };

  const wordCount = transcript.split(/\s+/).filter(Boolean).length;
  const lineCount = transcript.split('\n').length;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
      
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        
        {/* Meeting Type & Length Selectors */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              Meeting Type:
            </label>
            <select
              value={meetingType}
              onChange={(e) => setMeetingType(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-xs font-semibold text-purple-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="project">Project Launch</option>
              <option value="standup">Daily Standup</option>
              <option value="client">Client Meeting</option>
              <option value="interview">Interview</option>
              <option value="general">General Meeting</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-pink-400" />
              Summary Length:
            </label>
            <div className="flex gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {['short', 'medium', 'detailed'].map((len) => (
                <button
                  type="button"
                  key={len}
                  onClick={() => setSummaryLength(len)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                    summaryLength === len
                      ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/20'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {len}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sample Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium">Presets:</span>
          <button
            type="button"
            onClick={() => handlePreset('project')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition-all"
          >
            🚀 Product Launch
          </button>
          <button
            type="button"
            onClick={() => handlePreset('standup')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-pink-500/10 text-pink-300 border border-pink-500/20 hover:bg-pink-500/20 transition-all"
          >
            ⚡ Daily Standup
          </button>
          <button
            type="button"
            onClick={() => handlePreset('client')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
          >
            🤝 Client Requirements
          </button>
        </div>

      </div>

      {/* Transcript Textarea */}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="relative rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden font-mono text-xs shadow-inner">
          <div className="flex items-center justify-between px-3 py-2 bg-slate-900/60 border-b border-slate-800 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300">
              <FileText className="w-3.5 h-3.5 text-purple-400" />
              Meeting Transcript Input
            </span>
            <span className="font-mono">{wordCount} words | {lineCount} lines</span>
          </div>

          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste raw meeting transcript dialogue here (e.g. Rahul: Let's discuss...)..."
            rows={10}
            className="w-full bg-transparent p-3.5 text-slate-200 placeholder-slate-600 focus:outline-none resize-y leading-relaxed font-mono selection:bg-purple-500/30"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !transcript.trim()}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 via-pink-600 to-blue-600 hover:from-purple-400 hover:to-blue-500 text-white text-sm font-bold shadow-lg shadow-purple-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              Synthesizing Structured Meeting Intelligence...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              Summarize Meeting
            </>
          )}
        </button>

      </form>

    </div>
  );
}
