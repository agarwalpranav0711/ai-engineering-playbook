import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, Tag, AlertCircle, Sparkles, Pin } from 'lucide-react';

export default function TaskBoard({ workspace, onSelectTask, onAddTask, onUpdateTask, onDeleteTask }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [newTags, setNewTags] = useState('feature, backend');

  const filteredTasks = workspace.tasks.filter(task => {
    if (workspace.current_view === 'todo') return task.status !== 'done';
    if (workspace.current_view === 'done') return task.status === 'done';
    return true;
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask({
      title: newTitle.trim(),
      description: newDesc.trim(),
      priority: newPriority,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean)
    });
    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'high':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">High</span>;
      case 'low':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-500/20 text-slate-400 border border-slate-700">Low</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">Medium</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            Workspace Tasks
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any task card to set it as active Copilot context.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Task Creation Modal */}
      {showAddModal && (
        <form onSubmit={handleCreate} className="p-4 rounded-xl glass-panel space-y-3 animate-in fade-in duration-200 border border-indigo-500/30">
          <h3 className="text-sm font-semibold text-indigo-300">Create New Task</h3>
          <input
            type="text"
            placeholder="Task Title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-900/80 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            autoFocus
          />
          <textarea
            placeholder="Description / Notes (optional)"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 text-sm bg-slate-900/80 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <div className="flex gap-2">
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200"
            />
          </div>
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
              className="px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg"
            >
              Create
            </button>
          </div>
        </form>
      )}

      {/* Task List Grid */}
      <div className="grid gap-3">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center glass-card rounded-xl border border-slate-800">
            <AlertCircle className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-400">No tasks in this view.</p>
            <p className="text-xs text-slate-500 mt-1">Use the button above or tell Copilot to create tasks!</p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const isSelected = workspace.selected_item_id === task.id && workspace.selected_item_type === 'task';
            const isDone = task.status === 'done';

            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task.id)}
                className={`group p-4 rounded-xl glass-card transition-all cursor-pointer relative ${
                  isSelected ? 'border-indigo-500/80 bg-indigo-950/20 ring-1 ring-indigo-500/50' : 'hover:border-slate-700'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    <Pin className="w-3 h-3 text-indigo-400" /> ACTIVE CONTEXT
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateTask(task.id, { status: isDone ? 'todo' : 'done' });
                    }}
                    className="mt-0.5 text-slate-400 hover:text-indigo-400 transition-colors"
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 hover:text-indigo-400" />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 pr-24">
                      <h4 className={`text-sm font-semibold ${isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                        {task.title}
                      </h4>
                      {getPriorityBadge(task.priority)}
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {task.tags.map((tag, idx) => (
                          <span key={idx} className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/60">
                            <Tag className="w-2.5 h-2.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTask(task.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-all"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
