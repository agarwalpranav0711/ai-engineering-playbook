import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, RefreshCw, Sparkles, BookOpen } from 'lucide-react';

const SAMPLE_AI_NOTES = `AI Engineering & Architecture Handbook (Day 1 - Day 20)

CHAPTER 1: INTRODUCTION TO RETRIEVAL-AUGMENTED GENERATION (RAG)
Retrieval-Augmented Generation (RAG) is an advanced AI architecture that combines information retrieval with text generation. Instead of relying solely on the pre-trained knowledge stored inside a Large Language Model (LLM), RAG dynamically fetches relevant text chunks from an external vector store or knowledge database based on the user's specific query.

RAG solves three critical challenges in modern AI systems:
1. Hallucination Reduction: By grounding answers directly in retrieved document context, the LLM is prevented from inventing non-existent facts.
2. Domain Knowledge Integration: Custom proprietary documents, private APIs, and internal company guidelines can be queried without expensive model fine-tuning.
3. Source Attribution & Transparency: Every AI answer can provide explicit source citations (such as page numbers and paragraph snippets) so users can verify the information.

CHAPTER 2: CHUNKING, EMBEDDINGS, AND VECTOR DATABASES
The RAG ingestion pipeline consists of four fundamental steps:
1. Document Text Extraction: Parsing text from PDFs, Markdown, or HTML documents while preserving page number markers.
2. Text Chunking: Splitting large documents into smaller, coherent text chunks (typically 500 to 1000 characters) with overlapping windows (e.g. 100 characters) to preserve contextual boundaries.
3. Embedding Generation: Converting text chunks into high-dimensional numerical vectors that capture semantic meaning.
4. Vector Storage & Similarity Search: Storing vectors in a vector database like ChromaDB. When a user asks a question, cosine similarity search retrieves the top-K most relevant chunks.

CHAPTER 3: MULTI-AGENT SYSTEMS & AUTOGEN
Multi-Agent collaboration enables complex problem-solving by assigning distinct roles to specialized agents. For example, AutoGen and CrewAI allow agents such as a Resume Analyst, Job Matcher, and Critic to converse and iteratively refine outputs before producing a final validated decision.`;

export default function FileUpload({ onUpload, uploading, documentInfo }) {
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const loadSampleDocument = () => {
    const blob = new Blob([SAMPLE_AI_NOTES], { type: 'text/plain' });
    const file = new File([blob], 'sample-ai-handbook.txt', { type: 'text/plain' });
    onUpload(file);
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            1. Knowledge Base Ingestion
          </h2>
          <p className="text-xs text-slate-400">Upload a PDF document to chunk, embed, and index into Vector DB</p>
        </div>

        <button
          type="button"
          onClick={loadSampleDocument}
          disabled={uploading}
          className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Load Sample AI Handbook
        </button>
      </div>

      {documentInfo ? (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-emerald-200 block text-sm">{documentInfo.filename}</span>
              <span>Indexed {documentInfo.total_chunks} text chunks across {documentInfo.total_pages} page(s)</span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[11px]">
            ACTIVE VECTORS READY
          </span>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all bg-slate-900/40 ${
            dragActive ? 'border-purple-500 bg-purple-500/10' : 'border-slate-800 hover:border-purple-500/50'
          }`}
        >
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileChange}
            disabled={uploading}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              {uploading ? (
                <RefreshCw className="w-6 h-6 text-purple-400 animate-spin" />
              ) : (
                <Upload className="w-6 h-6 text-purple-400" />
              )}
            </div>
            <div>
              {uploading ? (
                <p className="text-sm font-semibold text-purple-300 animate-pulse">
                  Extracting text, chunking & indexing vectors...
                </p>
              ) : (
                <>
                  <p className="text-sm font-semibold text-slate-200">
                    Click to upload or drag & drop PDF
                  </p>
                  <p className="text-xs text-slate-500">Supports PDF or TXT files</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
