// Purpose: Displays the task information for each task in the Kanban board.
// Props:
//   task           - the single task this card shows
//   onStatusChange - called when the user picks a new status from the dropdown
//   onDelete       - called when the user clicks the delete button

import type { ChangeEvent } from 'react';
import type { TaskItemProps, TaskStatus } from '../types';

// Human-readable labels for each status.
const STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pending',
  'in-progress': 'In progress',
  completed: 'Completed',
};

// Today's date as YYYY-MM-DD in local time, so it compares with <input type="date"> values.
const todayString = () => {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const TaskItem = ({ task, onStatusChange, onDelete }: TaskItemProps) => {
  // Runs when the status dropdown changes: tell the parent WHICH task and its NEW status.
  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(task.id, e.target.value as TaskStatus);
  };

  // A task is overdue if it has a due date in the past and isn't finished yet.
  const isOverdue =
    task.dueDate !== '' && task.status !== 'completed' && task.dueDate < todayString();

  // Status + priority classes drive the colors in App.css.
  const className = [
    'task-item',
    `status-${task.status}`,
    `priority-${task.priority}`,
    isOverdue ? 'overdue' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className}>
      <div className="task-header">
        <h3 className="task-title">
          {task.status === 'completed' && <span aria-hidden="true">✓ </span>}
          {task.title}
        </h3>
        <span className={`badge priority-badge priority-${task.priority}`}>
          {task.priority}
        </span>
      </div>

      {/* Only show the description if there is one. */}
      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-meta">
        <span className={`badge status-badge status-${task.status}`}>
          {STATUS_LABELS[task.status]}
        </span>
        {/* Only show the due date if one was set. */}
        {task.dueDate && (
          <span className="task-due">
            Due: {task.dueDate}
            {isOverdue && <span className="badge overdue-badge">Overdue</span>}
          </span>
        )}
      </div>

      <div className="task-actions">
        <select
          value={task.status}
          onChange={handleStatusChange}
          aria-label={`Status for ${task.title}`}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
        </select>

        <button
          className="delete-btn"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete ${task.title}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
