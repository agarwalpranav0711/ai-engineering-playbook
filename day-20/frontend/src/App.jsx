import React, { useState } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [documentInfo, setDocumentInfo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle PDF upload
  const handleUpload = async (file) => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ detail: 'Upload error' }));
        throw new Error(errData.detail || `Server error ${res.status}`);
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Failed to upload document');
      }

      setDocumentInfo({
        document_id: data.document_id,
        filename: data.filename,
        total_pages: data.total_pages,
        total_chunks: data.total_chunks,
      });

      // Clear previous messages and add welcome assistant message
      setMessages([
        {
          role: 'assistant',
          content: `Document "${data.filename}" is indexed and ready! Chunked into ${data.total_chunks} text vectors across ${data.total_pages} page(s). Ask me any question about this document!`,
          sources: []
        }
      ]);

    } catch (err) {
      console.error("Document upload error:", err);
      setError(err.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  // Handle RAG Chat Question
  const handleSendMessage = async (question) => {
    if (!documentInfo) return;

    setError(null);
    setLoading(true);

    const userMessage = { role: 'user', content: question };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      // Build history format for API
      const historyPayload = messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          document_id: documentInfo.document_id,
          question,
          history: historyPayload,
          top_k: 3
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ detail: 'Chat API error' }));
        throw new Error(errData.detail || `Server error ${res.status}`);
      }

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to process question');
      }

      const assistantMessage = {
        role: 'assistant',
        content: data.answer,
        sources: data.sources || []
      };

      setMessages([...updatedMessages, assistantMessage]);

    } catch (err) {
      console.error("Chat RAG error:", err);
      setError(err.message || 'Failed to generate answer.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetDocument = () => {
    setDocumentInfo(null);
    setMessages([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 radial-glow-purple selection:bg-purple-500 selection:text-white pb-16">
      
      {/* Top Header */}
      <Header documentInfo={documentInfo} onResetDocument={handleResetDocument} />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-6">
        
        {/* Title */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            AI PDF <span className="gradient-text">Chat Assistant</span>
          </h2>
          <p className="text-sm text-slate-400">
            Ground your conversation in PDF knowledge. Chunked, indexed, and retrieved with page source references.
          </p>
        </div>

        {/* Upload Section */}
        <FileUpload
          onUpload={handleUpload}
          uploading={uploading}
          documentInfo={documentInfo}
        />

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <strong className="font-semibold block text-rose-200">System Alert</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Chat Thread */}
        <ChatWindow messages={messages} loading={loading} />

        {/* Chat Input */}
        <ChatInput
          onSend={handleSendMessage}
          loading={loading}
          disabled={!documentInfo || uploading}
        />

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        AI PDF Chat • Built for Day 20 AI Engineering Challenge • RAG Pipeline + Vector Store + React + FastAPI
      </footer>

    </div>
  );
}
