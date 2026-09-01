import React, { useState } from 'react';
import Header from './components/Header';
import Recorder from './components/Recorder';
import TranscriptView from './components/TranscriptView';
import NotesView from './components/NotesView';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [notesResult, setNotesResult] = useState(null);
  const [processingTime, setProcessingTime] = useState(0.0);
  const [isRecordingState, setIsRecordingState] = useState(false);
  const [lastTextRequest, setLastTextRequest] = useState(null);

  // 1. Process Voice File Upload or Recording
  const handleVoiceSubmit = async (audioFile, noteStyle = 'standard') => {
    setLoading(true);
    setError(null);
    setNotesResult(null);
    setTranscript('');

    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('note_style', noteStyle);

    try {
      const res = await fetch('/api/voice-to-notes', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ detail: 'API Error' }));
        throw new Error(errData.detail || `Server error ${res.status}`);
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to process voice recording');
      }

      setTranscript(data.transcript);
      setNotesResult(data.notes);
      setProcessingTime(data.processing_time_sec);
      setLastTextRequest({ transcript: data.transcript, note_style: noteStyle });
    } catch (err) {
      console.error("Voice Processing Error:", err);
      setError(err.message || 'An unexpected error occurred during audio processing.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Process Text Transcript (Presets or Edited Text)
  const handleTextSubmit = async (text, noteStyle = 'standard') => {
    setLoading(true);
    setError(null);
    setNotesResult(null);
    setTranscript(text);
    setLastTextRequest({ transcript: text, note_style: noteStyle });

    try {
      const res = await fetch('/api/notes-from-transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: text, note_style: noteStyle }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ detail: 'API Error' }));
        throw new Error(errData.detail || `Server error ${res.status}`);
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to synthesize notes from transcript');
      }

      setNotesResult(data.notes);
      setProcessingTime(data.processing_time_sec);
    } catch (err) {
      console.error("Transcript Notes Error:", err);
      setError(err.message || 'An unexpected error occurred during note synthesis.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (lastTextRequest) {
      handleTextSubmit(lastTextRequest.transcript, lastTextRequest.note_style);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 radial-glow-rose selection:bg-rose-500 selection:text-white pb-16">
      
      {/* Navbar Header */}
      <Header isRecording={isRecordingState} />

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-8">
        
        {/* Title */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Voice-to-Notes <span className="gradient-text-rose">AI</span>
          </h2>
          <p className="text-sm text-slate-400">
            Record spoken audio, transcribe speech to text, and synthesize structured action items, deadlines, decisions, and people.
          </p>
        </div>

        {/* Audio Recorder Input */}
        <Recorder
          onVoiceSubmit={handleVoiceSubmit}
          onTextSubmit={handleTextSubmit}
          loading={loading}
          setIsRecordingState={setIsRecordingState}
        />

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <strong className="font-semibold block text-rose-200">Processing Error</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Transcribed Speech Dialogue */}
        {transcript && (
          <TranscriptView
            initialTranscript={transcript}
            onRegenerateFromTranscript={handleTextSubmit}
            loading={loading}
          />
        )}

        {/* Synthesized Voice Notes */}
        {notesResult && (
          <NotesView
            notes={notesResult}
            processingTime={processingTime}
            onRegenerate={handleRegenerate}
            loading={loading}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        Voice-to-Notes AI • Built for Day 25 AI Engineering Challenge • FastAPI + MediaRecorder + Pydantic + React + Vite + OpenRouter
      </footer>

    </div>
  );
}
