// Purpose: The main screen. It owns all the state and connects the other components:
//   data flows DOWN to children as props, events flow UP through callback props.
// It also saves tasks to localStorage and handles JSON export/import.

import { useEffect, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { SortOption, Task, TaskFilters, TaskFormData, TaskStatus } from '../types';
import TaskForm from './TaskForm';
import TaskFilter from './TaskFilter';
import TaskList from './TaskList';
import TaskStats from './TaskStats';
import { EMPTY_FILTERS, filterTasks, getStatistics } from '../utils/taskFilters';
import { sortTasks } from '../utils/taskSort';
import { exportTasksToJson, loadTasks, parseImportedTasks, saveTasks } from '../utils/storage';

const Dashboard = () => {
  // The master list. The function form of useState reads localStorage only once, at startup.
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [filters, setFilters] = useState<TaskFilters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<SortOption>('created');
  const [editingId, setEditingId] = useState<string | null>(null); // which task is being edited
  const [message, setMessage] = useState('');                       // feedback for export/import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save to localStorage every time the task list changes.
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // ---------- Derived data (computed from state, never stored) ----------
  const editingTask = tasks.find((t) => t.id === editingId) ?? null;
  const visibleTasks = sortTasks(filterTasks(tasks, filters), sort); // filter first, then sort
  const stats = getStatistics(tasks); // stats cover ALL tasks, not just the visible ones

  // ---------- Handlers ----------

  // The form calls this for both adding and editing.
  const handleSubmit = (data: TaskFormData) => {
    if (editingId) {
      setTasks((prev) => prev.map((t) => (t.id === editingId ? { ...t, ...data } : t)));
      setEditingId(null);
    } else {
      const newTask: Task = { id: crypto.randomUUID(), ...data, status: 'pending' };
      setTasks((prev) => [...prev, newTask]);
    }
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
  };

  const handleDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (editingId === taskId) setEditingId(null); // don't keep editing a deleted task
  };

  const handleEdit = (taskId: string) => {
    setEditingId(taskId);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // bring the form into view
  };

  // Download the tasks as a JSON file.
  const handleExport = () => {
    if (tasks.length === 0) {
      setMessage('There are no tasks to export yet.');
      return;
    }
    const blob = new Blob([exportTasksToJson(tasks)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kanban-tasks.json';
    link.click();
    URL.revokeObjectURL(url);
    setMessage(`Exported ${tasks.length} task${tasks.length === 1 ? '' : 's'}.`);
  };

  // Read a chosen JSON file and replace the current tasks with its valid tasks.
  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;

    const result = parseImportedTasks(await file.text());
    if (result.error) {
      setMessage(result.error);
    } else if (
      tasks.length > 0 &&
      !window.confirm('Importing will replace your current tasks. Continue?')
    ) {
      setMessage('Import cancelled.');
    } else {
      setTasks(result.tasks);
      setEditingId(null);
      setMessage(
        `Imported ${result.tasks.length} task${result.tasks.length === 1 ? '' : 's'}` +
          (result.skipped > 0 ? ` (${result.skipped} invalid skipped).` : '.'),
      );
    }
    input.value = ''; // lets the user pick the same file again later
  };

  return (
    <div className="dashboard">
      <header id="header">

        <h1>[up.graded]</h1>
        <h2>🔥KANBAN SIDEKICK🔥</h2>
      </header>

      <TaskStats stats={stats} />

      {/* The key makes React rebuild the form when you switch between tasks (or back to "new"). */}
      <TaskForm
        key={editingTask?.id ?? 'new'}
        editingTask={editingTask}
        onSubmit={handleSubmit}
        onCancel={() => setEditingId(null)}
      />

      <TaskFilter filters={filters} onFilterChange={setFilters} />

      <TaskList
        tasks={visibleTasks}
        sort={sort}
        onSortChange={setSort}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <div className="data-controls">
        <button type="button" onClick={handleExport}>Export tasks</button>
        <button type="button" onClick={() => fileInputRef.current?.click()}>Import tasks</button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleImport}
          hidden
        />
      </div>

      {message && <p className="status-message" role="status">{message}</p>}
    </div>
  );
};

export default Dashboard;