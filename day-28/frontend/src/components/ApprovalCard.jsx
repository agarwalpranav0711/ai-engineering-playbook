import React from 'react';
import { AlertTriangle, Check, X, ShieldAlert } from 'lucide-react';

export default function ApprovalCard({ approvalRequest, onRespond }) {
  if (!approvalRequest) return null;

  return (
    <div className="my-3 p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Human Approval Required
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300">
              {approvalRequest.action}
            </span>
          </div>
          
          <p className="text-sm font-medium text-slate-200 mt-1">
            {approvalRequest.description}
          </p>

          {approvalRequest.target_title && (
            <div className="mt-2 text-xs font-mono bg-slate-900/60 p-2 rounded border border-slate-800 text-slate-300">
              Target: <span className="text-amber-300 font-semibold">{approvalRequest.target_title}</span> (ID: {approvalRequest.target_id})
            </div>
          )}

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => onRespond(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-all shadow-sm active:scale-95"
            >
              <Check className="w-4 h-4" />
              Approve Action
            </button>
            <button
              onClick={() => onRespond(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all active:scale-95"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
