import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Terminal, ShieldAlert, Cpu, User, RefreshCw, X, Layers, Check } from 'lucide-react';
import ApprovalCard from './ApprovalCard';

export default function CopilotPanel({ workspace, messages, onSendMessage, onRespondApproval, isLoading, isOpen, onClose }) {
  const [inputMsg, setInputMsg] = useState('');
  const chatBottomRef = useRef(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim() || isLoading) return;
    onSendMessage(inputMsg.trim());
    setInputMsg('');
  };

  const handleQuickPrompt = (promptText) => {
    if (isLoading) return;
    onSendMessage(promptText);
  };

  const selectedItemName = (() => {
    if (!workspace.selected_item_id) return null;
    if (workspace.selected_item_type === 'task') {
      const t = workspace.tasks.find(t => t.id === workspace.selected_item_id);
      return t ? `Task: ${t.title}` : `Task #${workspace.selected_item_id}`;
    }
    if (workspace.selected_item_type === 'note') {
      const n = workspace.notes.find(n => n.id === workspace.selected_item_id);
      return n ? `Note: ${n.title}` : `Note #${workspace.selected_item_id}`;
    }
    return null;
  })();

  if (!isOpen) return null;

  return (
    <div className="w-96 h-full border-l border-slate-800 bg-slate-950/90 backdrop-blur-xl flex flex-col shadow-2xl z-40 transition-all duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20 ai-glow">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              Mini AI Copilot
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Context-Aware Workspace Assistant
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Active Context Banner */}
      <div className="px-4 py-2.5 bg-indigo-950/30 border-b border-indigo-500/20 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2 text-indigo-300">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-medium">Active Context:</span>
          {selectedItemName ? (
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 font-mono text-indigo-200 border border-indigo-500/30 truncate max-w-[160px]">
              {selectedItemName}
            </span>
          ) : (
            <span className="text-slate-400 italic">Entire Workspace</span>
          )}
        </div>

        <span className="text-[10px] font-mono text-slate-400">
          {workspace.tasks.length} tasks • {workspace.notes.length} notes
        </span>
      </div>

      {/* Chat History Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans">
        {messages.length === 0 && (
          <div className="text-center py-8 px-4 space-y-3">
            <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400 w-fit mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-200">How can I assist your workspace today?</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              I can manage tasks, summarize notes, search content, or extract action items directly for you.
            </p>

            {/* Quick Prompt Chips */}
            <div className="pt-2 flex flex-col gap-1.5">
              <button
                onClick={() => handleQuickPrompt("Summarize my current workspace tasks and priorities")}
                className="text-left px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-indigo-300 transition-all"
              >
                💡 "Summarize workspace tasks & priorities"
              </button>
              <button
                onClick={() => handleQuickPrompt("Add task: Finish frontend polish and test approval dialog")}
                className="text-left px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-indigo-300 transition-all"
              >
                ➕ "Add task: Finish frontend polish"
              </button>
              {workspace.selected_item_id && (
                <button
                  onClick={() => handleQuickPrompt(`Delete the currently selected task`)}
                  className="text-left px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-xs text-amber-300 transition-all"
                >
                  ⚠️ "Delete currently selected task"
                </button>
              )}
            </div>
          </div>
        )}

        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';

          return (
            <div key={index} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[82%] space-y-2`}>
                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-md font-medium'
                    : 'glass-card text-slate-200 rounded-bl-none border border-slate-800'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {/* Tool Executions Badge */}
                {msg.tool_calls_executed && msg.tool_calls_executed.length > 0 && (
                  <div className="space-y-1">
                    {msg.tool_calls_executed.map((tc, tcIdx) => (
                      <div key={tcIdx} className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-emerald-400">
                        <Terminal className="w-3 h-3 text-emerald-400" />
                        <span>Executed: <strong>{tc.tool}</strong></span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Approval Card Request */}
                {msg.requires_approval && (
                  <ApprovalCard
                    approvalRequest={msg.requires_approval}
                    onRespond={onRespondApproval}
                  />
                )}
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center border border-slate-700 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 rounded-xl glass-card w-fit border border-slate-800 text-xs text-indigo-300 font-mono animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
            <span>Copilot is inspecting workspace & executing tools...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-900/60">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Ask Copilot or issue a workspace command..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            disabled={isLoading}
            className="w-full pl-3 pr-10 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-sans"
          />
          <button
            type="submit"
            disabled={!inputMsg.trim() || isLoading}
            className="absolute right-1.5 p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
