import React, { useState } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ImagePreview from './components/ImagePreview';
import CaptionResult from './components/CaptionResult';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [processingTime, setProcessingTime] = useState(0.0);
  const [lastRequest, setLastRequest] = useState(null);

  // 1. Handle File Selection
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setAnalysisResult(null);
    setError(null);
  };

  // 2. Handle Preset Image Simulation
  const handlePresetSelect = (presetType) => {
    setError(null);
    setAnalysisResult(null);
    let mockFile;
    if (presetType === 'coffee') {
      mockFile = new File(["dummy coffee bytes"], "coffee-shop-person.jpg", { type: "image/jpeg" });
    } else if (presetType === 'chart') {
      mockFile = new File(["dummy chart bytes"], "developer-chart.png", { type: "image/png" });
    } else if (presetType === 'receipt') {
      mockFile = new File(["dummy receipt bytes"], "store-receipt.png", { type: "image/png" });
    }
    setSelectedFile(mockFile);
  };

  // 3. Generate Image Caption API Call
  const handleGenerateCaption = async ({ file, style, custom_instruction }) => {
    setLoading(true);
    setError(null);
    setAnalysisResult(null);
    setLastRequest({ file, style, custom_instruction });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('style', style);
    formData.append('custom_instruction', custom_instruction || '');

    try {
      const res = await fetch('/api/caption', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ detail: 'API Error' }));
        throw new Error(errData.detail || `Server error ${res.status}`);
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate image caption');
      }

      setAnalysisResult(data.analysis);
      setProcessingTime(data.processing_time_sec);
    } catch (err) {
      console.error("Vision Processing Error:", err);
      setError(err.message || 'An unexpected error occurred during visual image processing.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Ask Visual Q&A API Call
  const handleAskQuestion = async (questionText) => {
    if (!selectedFile) throw new Error("No image file loaded.");
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('question', questionText);

    const res = await fetch('/api/ask-image', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error("Failed visual Q&A");
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Visual Q&A failed");
    return data.answer;
  };

  const handleReset = () => {
    setSelectedFile(null);
    setAnalysisResult(null);
    setError(null);
  };

  const handleRegenerate = () => {
    if (lastRequest) {
      handleGenerateCaption(lastRequest);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 radial-glow-amber selection:bg-amber-500 selection:text-white pb-16">
      
      {/* Navbar Header */}
      <Header />

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* Title */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Image Caption <span className="gradient-text-amber">Generator</span>
          </h2>
          <p className="text-sm text-slate-400">
            Multimodal Computer Vision pipeline for concise captions, detailed descriptions, object inventory, accessibility alt text, and visual Q&A.
          </p>
        </div>

        {/* Step 1: Image Uploader */}
        {!selectedFile && (
          <ImageUploader
            onFileSelect={handleFileSelect}
            onPresetSelect={handlePresetSelect}
            loading={loading}
          />
        )}

        {/* Step 2: Image Preview & Settings */}
        {selectedFile && (
          <ImagePreview
            file={selectedFile}
            onGenerate={handleGenerateCaption}
            onReset={handleReset}
            loading={loading}
          />
        )}

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <strong className="font-semibold block text-rose-200">Vision Error</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Step 3: Structured Vision Analysis Result */}
        {analysisResult && (
          <CaptionResult
            analysis={analysisResult}
            processingTime={processingTime}
            file={selectedFile}
            onAskQuestion={handleAskQuestion}
            onRegenerate={handleRegenerate}
            loading={loading}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        Image Caption Generator • Built for Day 26 AI Engineering Challenge • FastAPI + Pillow + Pydantic + React + Vite + OpenRouter
      </footer>

    </div>
  );
}
