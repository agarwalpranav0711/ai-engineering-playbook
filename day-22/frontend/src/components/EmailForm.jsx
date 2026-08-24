import React, { useState } from 'react';
import { Send, Sparkles, User, Target, MessageSquare, Sliders, Layers, UserCheck } from 'lucide-react';

const CATEGORIES = [
  { id: 'professional', label: 'Professional' },
  { id: 'academic', label: 'Academic' },
  { id: 'job_application', label: 'Job Application' },
  { id: 'follow_up', label: 'Follow-up' },
  { id: 'networking', label: 'Networking' },
  { id: 'leave_request', label: 'Leave Request' },
  { id: 'apology', label: 'Apology' },
  { id: 'thank_you', label: 'Thank You' },
];

const TONES = [
  'professional',
  'friendly',
  'formal',
  'casual',
  'confident',
  'persuasive',
  'apologetic',
  'concise',
];

const LENGTHS = ['short', 'medium', 'detailed'];

export default function EmailForm({ onGenerate, loading }) {
  const [emailType, setEmailType] = useState('academic');
  const [recipient, setRecipient] = useState('Professor Sharma');
  const [purpose, setPurpose] = useState('Request a 2-day extension on Assignment 3');
  const [context, setContext] = useState('I have been unwell with a severe fever over the past two days and need two extra days to complete the implementation and report properly.');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [senderName, setSenderName] = useState('Pranav');
  const [senderRole, setSenderRole] = useState('Computer Science Student');

  const handlePreset = (type) => {
    if (type === 'academic') {
      setEmailType('academic');
      setRecipient('Professor Sharma');
      setPurpose('Request a 2-day extension on Assignment 3');
      setContext('I have been unwell with a severe fever over the past two days and need two extra days to complete the implementation and report properly.');
      setTone('professional');
      setLength('medium');
      setSenderName('Pranav');
      setSenderRole('Computer Science Student');
    } else if (type === 'job') {
      setEmailType('job_application');
      setRecipient('Hiring Manager');
      setPurpose('Follow up after software engineering interview');
      setContext('I interviewed for the Software Engineering Intern position last Friday. I enjoyed discussing the team\'s distributed systems architecture and want to check on next steps.');
      setTone('confident');
      setLength('medium');
      setSenderName('Pranav');
      setSenderRole('Software Developer Candidate');
    } else if (type === 'networking') {
      setEmailType('networking');
      setRecipient('Senior AI Engineer');
      setPurpose('Request a 15-minute virtual coffee chat for career advice');
      setContext('I read your recent open-source work on RAG pipelines and Pydantic validation. I am a 3rd-year CS student pursuing AI Engineering and would love to ask 2-3 questions about your career transition.');
      setTone('friendly');
      setLength('short');
      setSenderName('Pranav');
      setSenderRole('AI Engineering Student');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!purpose.trim()) return;

    onGenerate({
      email_type: emailType,
      recipient,
      purpose,
      context,
      tone,
      length,
      sender_name: senderName,
      sender_role: senderRole,
    });
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
      
      {/* Presets Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Step 1: Define Situation</span>
          <h2 className="text-lg font-bold text-white">Email Generation Parameters</h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium">Presets:</span>
          <button
            type="button"
            onClick={() => handlePreset('academic')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
          >
            🎓 Professor Extension
          </button>
          <button
            type="button"
            onClick={() => handlePreset('job')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition-all"
          >
            💼 Recruiter Follow-up
          </button>
          <button
            type="button"
            onClick={() => handlePreset('networking')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-pink-500/10 text-pink-300 border border-pink-500/20 hover:bg-pink-500/20 transition-all"
          >
            ☕ Cold Networking
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Category & Recipient Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Email Type Category:
            </label>
            <select
              value={emailType}
              onChange={(e) => setEmailType(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-xs font-semibold text-indigo-300 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              Recipient:
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. Professor Sharma, Hiring Manager"
              className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 placeholder-slate-600"
            />
          </div>

        </div>

        {/* Purpose Input */}
        <div>
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
            <Target className="w-3.5 h-3.5 text-purple-400" />
            Primary Purpose / Goal:
          </label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g. Request a 2-day extension on Assignment 3"
            className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 placeholder-slate-600 font-medium"
          />
        </div>

        {/* Context Textarea */}
        <div>
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-pink-400" />
            Background Context & Supplied Facts:
          </label>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={3}
            placeholder="Provide background context and specific facts for the AI to include without hallucinating..."
            className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 focus:outline-none focus:border-indigo-500 placeholder-slate-600 leading-relaxed resize-y"
          />
        </div>

        {/* Tone Pill Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            Tone Control:
          </label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTone(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
                  tone === t
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-md shadow-indigo-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Length Pill Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            Email Length:
          </label>
          <div className="flex gap-2">
            {LENGTHS.map((l) => (
              <button
                type="button"
                key={l}
                onClick={() => setLength(l)}
                className={`px-4 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
                  length === l
                    ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/20'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Sender Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/60">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mb-1">
              <UserCheck className="w-3 h-3 text-slate-500" />
              Sender Name:
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mb-1">
              Sender Role / Title (Optional):
            </label>
            <input
              type="text"
              value={senderRole}
              onChange={(e) => setSenderRole(e.target.value)}
              placeholder="e.g. Student, Developer"
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !purpose.trim()}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-400 hover:to-pink-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              Synthesizing Structured Email...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Generate Email
            </>
          )}
        </button>

      </form>

    </div>
  );
}
