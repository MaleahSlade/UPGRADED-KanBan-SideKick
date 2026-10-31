// Purpose: Lets the user narrow the task list by search text, status and priority.
// Props:
//   filters        - the current filter values (owned by the parent)
//   onFilterChange - called with the full, updated filters whenever the user changes one

import type { ChangeEvent } from 'react';
import type { Priority, TaskFilterProps, TaskFilters, TaskStatus } from '../types';
import { EMPTY_FILTERS, hasActiveFilters } from '../utils/taskFilters';

// Labels used on the active-filter chips.
const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pending',
  'in-progress': 'In progress',
  completed: 'Completed',
};

const TaskFilter = ({ filters, onFilterChange }: TaskFilterProps) => {
  // Build the next filters object from the current one plus a change.
  const update = (changes: Partial<TaskFilters>) => onFilterChange({ ...filters, ...changes });

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
    update({ search: e.target.value });

  // An empty string means "All", which becomes undefined (no filter).
  const handleStatus = (e: ChangeEvent<HTMLSelectElement>) =>
    update({ status: (e.target.value as TaskStatus) || undefined });

  const handlePriority = (e: ChangeEvent<HTMLSelectElement>) =>
    update({ priority: (e.target.value as Priority) || undefined });

  const search = filters.search.trim();

  return (
    <section className="task-filter" aria-label="Filter tasks">
      <input
        type="search"
        className="search-input"
        placeholder="Search tasks..."
        aria-label="Search tasks"
        value={filters.search}
        onChange={handleSearch}
      />

      <select aria-label="Filter by status" value={filters.status ?? ''} onChange={handleStatus}>
        <option value="">All statuses</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In progress</option>
        <option value="completed">Completed</option>
      </select>

      <select aria-label="Filter by priority" value={filters.priority ?? ''} onChange={handlePriority}>
        <option value="">All priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      {/* Active filter indicators: one removable chip per active filter. */}
      {hasActiveFilters(filters) && (
        <div className="active-filters" aria-live="polite">
          <span className="active-label">Active filters:</span>

          {search && (
            <button type="button" className="chip" onClick={() => update({ search: '' })}>
              Search: “{search}” ✕
            </button>
          )}
          {filters.status && (
            <button type="button" className="chip" onClick={() => update({ status: undefined })}>
              Status: {STATUS_LABELS[filters.status]} ✕
            </button>
          )}
          {filters.priority && (
            <button type="button" className="chip" onClick={() => update({ priority: undefined })}>
              Priority: {filters.priority} ✕
            </button>
          )}

          <button type="button" className="clear-btn" onClick={() => onFilterChange(EMPTY_FILTERS)}>
            Clear all
          </button>
        </div>
      )}
    </section>
  );
};

export default TaskFilter;