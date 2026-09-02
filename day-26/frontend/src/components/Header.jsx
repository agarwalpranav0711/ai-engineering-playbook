import React from 'react';
import { Image, Sparkles, ShieldCheck, Eye } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Image className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">Image Caption Generator</h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Day 26
              </span>
            </div>
            <p className="text-xs text-slate-400">Multimodal Computer Vision, Object Extraction & Accessibility Alt Text Engine</p>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-300">
            <Eye className="w-3.5 h-3.5" />
            <span>Multimodal Vision Ready</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>OpenRouter image_url</span>
          </div>
        </div>

      </div>
    </header>
  );
}
