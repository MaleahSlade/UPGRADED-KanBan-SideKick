// localStorage persistence plus JSON export/import.

import type { Task } from '../types';
import { isValidDateString } from './dates';

const STORAGE_KEY = 'kanban-sidekick:tasks';

const STATUSES = ['pending', 'in-progress', 'completed'];
const PRIORITIES = ['low', 'medium', 'high'];

// Type guard: is this unknown value a well-formed Task?
export const isTask = (value: unknown): value is Task => {
  if (typeof value !== 'object' || value === null) return false;
  const t = value as Record<string, unknown>;
  return (
    typeof t.id === 'string' && t.id !== '' &&
    typeof t.title === 'string' && t.title.trim() !== '' &&
    typeof t.description === 'string' &&
    typeof t.status === 'string' && STATUSES.includes(t.status) &&
    typeof t.priority === 'string' && PRIORITIES.includes(t.priority) &&
    typeof t.dueDate === 'string' && (t.dueDate === '' || isValidDateString(t.dueDate))
  );
};

// Read saved tasks. Returns [] if nothing is saved or the data is damaged.
export const loadTasks = (): Task[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isTask) : [];
  } catch {
    return [];
  }
};

// Save tasks. Fails quietly if storage is full or blocked.
export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Storage unavailable; the app still works for this session.
  }
};

// Turn the tasks into a JSON string for downloading.
export const exportTasksToJson = (tasks: Task[]): string => JSON.stringify(tasks, null, 2);

// Result of reading an imported file.
export interface ImportResult {
  tasks: Task[];   // The valid tasks found
  skipped: number; // How many entries were invalid and ignored
  error?: string;  // Set if the whole file was unusable
}

// Parse and validate imported JSON text.
export const parseImportedTasks = (text: string): ImportResult => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { tasks: [], skipped: 0, error: 'That file is not valid JSON.' };
  }
  if (!Array.isArray(parsed)) {
    return { tasks: [], skipped: 0, error: 'Expected a list of tasks.' };
  }
  const seen = new Set<string>();
  const tasks: Task[] = [];
  for (const item of parsed) {
    if (isTask(item) && !seen.has(item.id)) {
      seen.add(item.id);
      tasks.push(item);
    }
  }
  return { tasks, skipped: parsed.length - tasks.length };
};