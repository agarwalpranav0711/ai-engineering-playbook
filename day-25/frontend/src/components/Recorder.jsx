import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Upload, Sparkles, FileAudio, Sliders, AlertCircle } from 'lucide-react';

const PRESET_TASK = "Tomorrow I need to finish the authentication module and then test the API. I also need to ask Rahul about the deployment credentials.";
const PRESET_HINGLISH = "Kal mujhe authentication complete karni hai aur phir API test karni hai. Rahul se deployment credentials ke baare mein baat karni hai.";
const PRESET_TECHNICAL = "Yesterday I completed the Day 24 AI Research Assistant. Today I am working on the Day 25 Voice-to-Notes AI using FastAPI, MediaRecorder API, and Pydantic. Kriti will help test frontend integration by end of day.";

export default function Recorder({ onVoiceSubmit, onTextSubmit, loading, setIsRecordingState }) {
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [noteStyle, setNoteStyle] = useState('standard');
  const [micError, setMicError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    setMicError(null);
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setSelectedFile(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        // Stop tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
      if (setIsRecordingState) setIsRecordingState(true);
      setTimer(0);

      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone access error:", err);
      setMicError("Microphone access was denied or not supported by browser. You can still upload audio files or use text presets below.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      if (setIsRecordingState) setIsRecordingState(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setAudioBlob(null);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(URL.createObjectURL(file));
    }
  };

  const handlePreset = (text) => {
    onTextSubmit(text, noteStyle);
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onVoiceSubmit(selectedFile, noteStyle);
    } else if (audioBlob) {
      const audioFile = new File([audioBlob], 'voice_recording.webm', { type: 'audio/webm' });
      onVoiceSubmit(audioFile, noteStyle);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
      
      {/* Controls Bar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Step 1: Input Spoken Audio</span>
          <h2 className="text-lg font-bold text-white">Record Microphone or Upload Audio</h2>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-rose-400" />
            Style:
          </label>
          <select
            value={noteStyle}
            onChange={(e) => setNoteStyle(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs font-semibold text-rose-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-rose-500 cursor-pointer"
          >
            <option value="standard">Standard Notes</option>
            <option value="action_focused">Action Focused</option>
            <option value="detailed">Detailed Analysis</option>
          </select>
        </div>
      </div>

      {/* Mic Denial Alert */}
      {micError && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{micError}</span>
        </div>
      )}

      {/* Recording Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Microphone Box */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="relative">
            {recording && (
              <span className="absolute -inset-2 rounded-full bg-rose-500/30 animate-ping" />
            )}
            <button
              type="button"
              onClick={recording ? stopRecording : startRecording}
              disabled={loading}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
                recording
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/40'
                  : 'bg-gradient-to-tr from-rose-500 via-pink-600 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white shadow-rose-500/30'
              }`}
            >
              {recording ? <Square className="w-6 h-6 fill-white" /> : <Mic className="w-7 h-7" />}
            </button>
          </div>

          <div>
            <span className="text-xl font-mono font-bold text-white block">
              {recording ? formatTimer(timer) : '00:00'}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {recording ? '🔴 Recording active... Click to stop' : 'Click microphone to start recording'}
            </span>
          </div>
        </div>

        {/* Audio Upload Box */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center space-y-3 text-center">
          <FileAudio className="w-8 h-8 text-rose-400" />
          <div>
            <label className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500 text-xs font-semibold text-slate-200 cursor-pointer transition-all flex items-center gap-2">
              <Upload className="w-3.5 h-3.5 text-rose-400" />
              <span>Choose Audio File (.webm, .wav, .mp3)</span>
              <input type="file" accept="audio/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
          {selectedFile && (
            <span className="text-xs text-rose-300 font-mono">Uploaded: {selectedFile.name}</span>
          )}
        </div>

      </div>

      {/* Audio Preview Player */}
      {audioUrl && (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-300 block">🎧 Audio Preview Player:</span>
          <audio controls src={audioUrl} className="w-full h-10 accent-rose-500" />
        </div>
      )}

      {/* Sample Presets */}
      <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-800">
        <span className="text-xs text-slate-400 font-medium">Sample Presets:</span>
        <button
          type="button"
          onClick={() => handlePreset(PRESET_TASK)}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
        >
          📝 Task Voice Note
        </button>
        <button
          type="button"
          onClick={() => handlePreset(PRESET_HINGLISH)}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition-all"
        >
          🌐 Hinglish Note
        </button>
        <button
          type="button"
          onClick={() => handlePreset(PRESET_TECHNICAL)}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/20 hover:bg-blue-500/20 transition-all"
        >
          ⚡ Technical Meeting
        </button>
      </div>

      {/* Submit CTA */}
      {(audioBlob || selectedFile) && (
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white text-sm font-bold shadow-lg shadow-rose-500/20 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              Transcribing Speech & Synthesizing AI Notes...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              Process Voice to AI Notes
            </>
          )}
        </button>
      )}

    </div>
  );
}
