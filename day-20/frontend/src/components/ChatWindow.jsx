import React, { useEffect, useRef } from 'react';
import { Bot, User, RefreshCw, MessageSquare } from 'lucide-react';
import SourceBadge from './SourceBadge';

export default function ChatWindow({ messages, loading }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (messages.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center border border-slate-800 flex flex-col items-center justify-center space-y-3 min-h-[300px]">
        <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-purple-400" />
        </div>
        <h3 className="text-base font-bold text-white">No Messages Yet</h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Upload a PDF document above and ask questions. Answers will be grounded in document context with page source references!
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6 max-h-[500px] overflow-y-auto">
      
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {/* Avatar for Assistant */}
          {msg.role === 'assistant' && (
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-4 h-4 text-purple-300" />
            </div>
          )}

          {/* Message Content Bubble */}
          <div
            className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none shadow-lg shadow-purple-600/10'
                : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none'
            }`}
          >
            <p className="whitespace-pre-wrap">{msg.content}</p>

            {/* Render Source Citations for Assistant */}
            {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
              <SourceBadge sources={msg.sources} />
            )}
          </div>

          {/* Avatar for User */}
          {msg.role === 'user' && (
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-1">
              <User className="w-4 h-4 text-indigo-300" />
            </div>
          )}
        </div>
      ))}

      {/* RAG Query Loading Indicator */}
      {loading && (
        <div className="flex gap-3 justify-start items-center">
          <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4 text-purple-300" />
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-purple-300 flex items-center gap-2 rounded-tl-none">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
            <span>Searching vector store & synthesizing grounded answer...</span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
