// Sorting logic. Always returns a new array; the original is never changed.

import type { Priority, SortOption, Task, TaskStatus } from '../types';

// Labels for the sort dropdown.
export const SORT_LABELS: Record<SortOption, string> = {
  created: 'Date added',
  dueDate: 'Due date',
  priority: 'Priority (high first)',
  status: 'Status',
  title: 'Title (A-Z)',
};

const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
const STATUS_RANK: Record<TaskStatus, number> = { pending: 0, 'in-progress': 1, completed: 2 };

export const sortTasks = (tasks: Task[], sort: SortOption): Task[] => {
  const copy = [...tasks];
  switch (sort) {
    case 'dueDate':
      // Earliest first; tasks with no due date go last.
      return copy.sort((a, b) => {
        if (a.dueDate === b.dueDate) return 0;
        if (a.dueDate === '') return 1;
        if (b.dueDate === '') return -1;
        return a.dueDate < b.dueDate ? -1 : 1;
      });
    case 'priority':
      return copy.sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);
    case 'status':
      return copy.sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status]);
    case 'title':
      return copy.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
    case 'created':
    default:
      // The array is already in the order tasks were added.
      return copy;
  }
};