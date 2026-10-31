// Filtering and statistics logic, kept out of the components so it is easy to test.

import type { Task, TaskFilters, TaskStatistics } from '../types';
import { isOverdue } from './dates';

// The filters when nothing is selected.
export const EMPTY_FILTERS: TaskFilters = { search: '' };

// True if any filter is active.
export const hasActiveFilters = (filters: TaskFilters): boolean =>
  filters.search.trim() !== '' || !!filters.status || !!filters.priority;

// Keep only the tasks that match every active filter.
export const filterTasks = (tasks: Task[], filters: TaskFilters): Task[] => {
  const query = filters.search.trim().toLowerCase();
  return tasks.filter((t) => {
    const matchesSearch =
      query === '' ||
      t.title.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query);
    const matchesStatus = !filters.status || t.status === filters.status;
    const matchesPriority = !filters.priority || t.priority === filters.priority;
    return matchesSearch && matchesStatus && matchesPriority;
  });
};

// Count tasks by status for the dashboard.
export const getStatistics = (tasks: Task[]): TaskStatistics => {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  return {
    total,
    pending: tasks.filter((t) => t.status === 'pending').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    completed,
    overdue: tasks.filter((t) => isOverdue(t.dueDate, t.status === 'completed')).length,
    completionRate: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
};