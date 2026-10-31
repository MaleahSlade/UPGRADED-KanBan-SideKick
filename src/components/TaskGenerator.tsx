// Purpose: Creates the tasks that will be displayed on the Kanban board as TaskItems.
// Props:
//   onTaskAdd - called with the finished task when the user submits the form

import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Task, TaskGeneratorProps } from '../types';

const TaskGenerator = ({ onTaskAdd }: TaskGeneratorProps) => {
  // One piece of state for each form field.
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [dueDate, setDueDate] = useState('');

  // Runs when the form is submitted: build a new Task and send it to the parent.
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // stop the page from reloading

    if (title.trim() === '') return; // a task needs a title

    onTaskAdd({
      id: crypto.randomUUID(), // unique id for this task
      title: title.trim(),
      description: description.trim(),
      status: 'pending',       // new tasks always start as pending
      priority,
      dueDate,
    });

    // Clear the form for the next task.
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task title"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as Task['priority'])}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <button type="submit">Add Task</button>
    </form>
  );
};

export default TaskGenerator;
