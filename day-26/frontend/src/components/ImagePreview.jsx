import React, { useState, useEffect } from 'react';
import { Sliders, Sparkles, X, FileText, Image as ImageIcon } from 'lucide-react';

const STYLES = [
  { id: 'descriptive', label: 'Descriptive' },
  { id: 'short', label: 'Short' },
  { id: 'social', label: 'Social Media' },
  { id: 'professional', label: 'Professional' },
  { id: 'accessibility', label: 'Accessibility (Alt)' },
  { id: 'technical', label: 'Technical' },
];

export default function ImagePreview({ file, onGenerate, onReset, loading }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [style, setStyle] = useState('descriptive');
  const [customInstruction, setCustomInstruction] = useState('');

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!file || !previewUrl) return null;

  const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate({ file, style, custom_instruction: customInstruction });
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6 animate-in fade-in duration-300">
      
      {/* Header & Reset Button */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Step 2: Configure & Generate</span>
          <h2 className="text-lg font-bold text-white">Image Preview & Style Settings</h2>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white transition-all flex items-center gap-1.5"
        >
          <X className="w-3.5 h-3.5" />
          <span>New Image</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Image Preview Box & Metadata */}
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 max-h-80 flex items-center justify-center p-2 shadow-inner">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-72 object-contain rounded-xl"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
            <span className="truncate max-w-[180px] font-semibold">{file.name}</span>
            <span>{fileSizeMB} MB</span>
            <span className="uppercase text-amber-400 font-bold">{file.type.split('/')[1] || 'image'}</span>
          </div>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Style Selector Pills */}
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              Caption Style:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STYLES.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-medium transition-all ${
                    style === s.id
                      ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold shadow-md shadow-amber-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Instruction Input */}
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
              <FileText className="w-3.5 h-3.5 text-orange-400" />
              Optional Custom Instruction:
            </label>
            <textarea
              value={customInstruction}
              onChange={(e) => setCustomInstruction(e.target.value)}
              placeholder="e.g., 'Describe the image for a travel blog' or 'Identify key chart trends'..."
              rows={2}
              className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl p-3 focus:outline-none focus:border-amber-500 placeholder-slate-600 resize-y"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 hover:from-amber-400 hover:to-red-500 text-white text-sm font-bold shadow-lg shadow-amber-500/20 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                Analyzing Multimodal Visual Content...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Image Caption
              </>
            )}
          </button>

        </form>

      </div>

    </div>
  );
}
