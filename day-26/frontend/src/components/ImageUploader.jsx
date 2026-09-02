import React, { useState } from 'react';
import { Upload, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';

export default function ImageUploader({ onFileSelect, onPresetSelect, loading }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
      
      {/* Controls Bar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Step 1: Upload Image</span>
          <h2 className="text-lg font-bold text-white">Select or Drag & Drop Image File</h2>
        </div>

        {/* Sample Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium">Presets:</span>
          <button
            type="button"
            onClick={() => onPresetSelect('coffee')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
          >
            ☕ Coffee Shop
          </button>
          <button
            type="button"
            onClick={() => onPresetSelect('chart')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
          >
            📊 Bar Chart
          </button>
          <button
            type="button"
            onClick={() => onPresetSelect('receipt')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition-all"
          >
            🧾 Store Receipt OCR
          </button>
        </div>
      </div>

      {/* Drag & Drop Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center space-y-4 text-center ${
          isDragOver
            ? 'border-amber-500 bg-amber-500/10 scale-[1.01]'
            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <Upload className="w-7 h-7 text-amber-400" />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-bold text-white">Drag & drop your image here</p>
          <p className="text-xs text-slate-400">Supports PNG, JPEG, WEBP, GIF up to 10 MB</p>
        </div>

        <label className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs font-bold shadow-lg shadow-amber-500/20 cursor-pointer transition-all flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          <span>Browse File</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handleFileInput}
            className="hidden"
          />
        </label>
      </div>

    </div>
  );
}
