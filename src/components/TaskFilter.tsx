// Purpose: Filters tasks by status and/or priority.
// Props: onFilterChange - called whenever the user changes a filter. It passes up
// the current choices (status and/or priority); a missing value means "show all".

import { useState } from 'react';
//ChangeEvent used to describe the event object when a dropdown changes
import type { ChangeEvent } from 'react';
import type { TaskStatus, TaskFilterProps } from '../types';
//
type Priority = 'low' | 'medium' | 'high';



const TaskFilter = ({ onFilterChange }: TaskFilterProps) => {
  const [status, setStatus] = useState<TaskStatus | ''>('');
  const [priority, setPriority] = useState<Priority | ''>('');

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as TaskStatus | '';
    setStatus(newStatus);
    onFilterChange({ status: newStatus || undefined, priority: priority || undefined });
  };

  const handlePriorityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newPriority = e.target.value as Priority | '';
    setPriority(newPriority);
    onFilterChange({ status: status || undefined, priority: newPriority || undefined });
  };

  return (
    <div className="task-filter">
      <select aria-label="Filter by status" value={status} onChange={handleStatusChange}>
        <option value="">All statuses</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In progress</option>
        <option value="completed">Completed</option>
      </select>

      <select aria-label="Filter by priority" value={priority} onChange={handlePriorityChange}>
        <option value="">All priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  );
};

export default TaskFilter;