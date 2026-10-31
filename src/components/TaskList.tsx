// Purpose: Displays the (already filtered and sorted) tasks and lets the user choose a sort order.
// Props:
//   tasks          - the tasks to display (one TaskItem is rendered for each)
//   sort           - the current sort option
//   onSortChange   - called when the user picks a different sort
//   onStatusChange - passed straight through to every TaskItem
//   onDelete       - passed straight through to every TaskItem
//   onEdit         - passed straight through to every TaskItem

import type { ChangeEvent } from 'react';
import type { SortOption, TaskListProps } from '../types';
import { SORT_LABELS } from '../utils/taskSort';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, sort, onSortChange, onStatusChange, onDelete, onEdit }: TaskListProps) => {
  const handleSort = (e: ChangeEvent<HTMLSelectElement>) =>
    onSortChange(e.target.value as SortOption);

  return (
    <section className="task-list-section" aria-label="Tasks">
      <div className="list-toolbar">
        <span className="task-count">
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </span>
        <label className="sort-control">
          Sort by{' '}
          <select value={sort} onChange={handleSort}>
            {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
              <option key={option} value={option}>{SORT_LABELS[option]}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Show a friendly message when there is nothing to display. */}
      {tasks.length === 0 ? (
        <p className="empty-message">No tasks to show.</p>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            // key lets React track each card; the task id is unique.
            <TaskItem
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default TaskList;
