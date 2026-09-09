import React, { useState } from 'react';
import { FileText, Plus, Sparkles, Tag, Pin, Check, Edit2 } from 'lucide-react';

export default function NoteEditor({ workspace, onSelectNote, onAddNote, onUpdateNote, onExtractTasks }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddNote({
      title: newTitle.trim(),
      content: newContent.trim(),
      tags: ['note', 'ideas']
    });
    setNewTitle('');
    setNewContent('');
    setShowAddModal(false);
  };

  const handleSaveEdit = (noteId) => {
    onUpdateNote(noteId, { content: editContent });
    setEditingNoteId(null);
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            Workspace Notes
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {workspace.notes.length} {workspace.notes.length === 1 ? 'note' : 'notes'}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any note to make it the active context for Copilot summarization or task extraction.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Note
        </button>
      </div>

      {/* Note Creation Modal */}
      {showAddModal && (
        <form onSubmit={handleCreate} className="p-4 rounded-xl glass-panel space-y-3 animate-in fade-in duration-200 border border-purple-500/30">
          <h3 className="text-sm font-semibold text-purple-300">Create New Note</h3>
          <input
            type="text"
            placeholder="Note Title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-900/80 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            autoFocus
          />
          <textarea
            placeholder="Note content (supports bullet points for task extraction)..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 text-sm bg-slate-900/80 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono text-xs"
          />
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-medium bg-purple-600 hover:bg-purple-500 text-white rounded-lg"
            >
              Save Note
            </button>
          </div>
        </form>
      )}

      {/* Notes Grid */}
      <div className="grid gap-3">
        {workspace.notes.length === 0 ? (
          <div className="p-8 text-center glass-card rounded-xl border border-slate-800">
            <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-400">No notes in workspace.</p>
          </div>
        ) : (
          workspace.notes.map(note => {
            const isSelected = workspace.selected_item_id === note.id && workspace.selected_item_type === 'note';
            const isEditing = editingNoteId === note.id;

            return (
              <div
                key={note.id}
                onClick={() => onSelectNote(note.id)}
                className={`p-4 rounded-xl glass-card transition-all cursor-pointer relative ${
                  isSelected ? 'border-purple-500/80 bg-purple-950/20 ring-1 ring-purple-500/50' : 'hover:border-slate-700'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    <Pin className="w-3 h-3 text-purple-400" /> ACTIVE CONTEXT
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <h4 className="text-sm font-semibold text-slate-200">{note.title}</h4>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onExtractTasks(note.id);
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 text-[10px] font-medium transition-all"
                      title="Extract bullet points into tasks using AI"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      Extract Tasks
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <div className="mt-3 space-y-2" onClick={(e) => e.stopPropagation()}>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-900 border border-purple-500/50 rounded-lg text-slate-200 focus:outline-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingNoteId(null)}
                        className="px-2 py-1 text-[10px] text-slate-400 hover:text-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSaveEdit(note.id)}
                        className="px-2.5 py-1 text-[10px] bg-purple-600 hover:bg-purple-500 text-white rounded font-medium"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-xs font-mono text-slate-300 whitespace-pre-wrap bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
                    {note.content || <span className="italic text-slate-500">(Empty note)</span>}
                  </div>
                )}

                <div className="flex items-center justify-between mt-3 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    {note.tags && note.tags.map((tag, idx) => (
                      <span key={idx} className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                        <Tag className="w-2.5 h-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {!isEditing && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingNoteId(note.id);
                        setEditContent(note.content);
                      }}
                      className="flex items-center gap-1 hover:text-purple-300"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
