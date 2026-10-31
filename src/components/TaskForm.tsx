// Purpose: A controlled form that adds a new task or edits an existing one.
// Props:
//   editingTask - if provided, the form is pre-filled and works in "edit" mode
//   onSubmit    - called with the validated form data when the user submits
//   onCancel    - called when the user cancels editing (only shown in edit mode)
// Tip: give this component a different `key` when editingTask changes so the
// form fields reset to the new task's values (Dashboard does this).

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import type { Priority, TaskFormData, TaskFormErrors, TaskFormProps } from '../types';
import { DESCRIPTION_MAX, isFormValid, validateTaskForm } from '../utils/validation';
import { todayString } from '../utils/dates';

const EMPTY_FORM: TaskFormData = { title: '', description: '', priority: 'medium', dueDate: '' };

const TaskForm = ({ editingTask, onSubmit, onCancel }: TaskFormProps) => {
  const isEditing = !!editingTask;

  // The current value of every field.
  const [values, setValues] = useState<TaskFormData>(
    editingTask
      ? {
          title: editingTask.title,
          description: editingTask.description,
          priority: editingTask.priority,
          dueDate: editingTask.dueDate,
        }
      : EMPTY_FORM,
  );
  // Which fields the user has already visited, so errors only show after interaction.
  const [touched, setTouched] = useState<Partial<Record<keyof TaskFormData, boolean>>>({});
  // Becomes true after the first submit attempt, so every error shows.
  const [submitted, setSubmitted] = useState(false);

  // When editing, a task that is already overdue may keep its old due date.
  const allowPast = !!editingTask && values.dueDate === editingTask.dueDate;
  const errors: TaskFormErrors = validateTaskForm(values, allowPast);

  // Only show an error once the field was touched or a submit was attempted.
  const errorFor = (field: keyof TaskFormData) =>
    touched[field] || submitted ? errors[field] : undefined;

  // One handler updates whichever field changed.
  const handleChange =
    (field: keyof TaskFormData) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = field === 'priority' ? (e.target.value as Priority) : e.target.value;
      setValues((prev) => ({ ...prev, [field]: value }));
    };

  // Mark a field as visited when the user leaves it.
  const handleBlur = (field: keyof TaskFormData) => () =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // stop the page from reloading
    setSubmitted(true);
    if (!isFormValid(errors)) return; // show feedback instead of submitting

    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      priority: values.priority,
      dueDate: values.dueDate,
    });

    // Clear the form after adding. (After editing, the parent closes edit mode.)
    if (!isEditing) {
      setValues(EMPTY_FORM);
      setTouched({});
      setSubmitted(false);
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <h2>{isEditing ? 'Edit task' : 'Add a task'}</h2>

      <div className="form-field">
        <label htmlFor="task-title">Title</label>
        <input
          id="task-title"
          type="text"
          placeholder="Task title"
          value={values.title}
          onChange={handleChange('title')}
          onBlur={handleBlur('title')}
          aria-invalid={!!errorFor('title')}
        />
        {errorFor('title') && (
          <p className="field-error" role="alert">{errorFor('title')}</p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="task-description">
          Description{' '}
          <span className="char-count">{values.description.length}/{DESCRIPTION_MAX}</span>
        </label>
        <textarea
          id="task-description"
          placeholder="Description (optional)"
          value={values.description}
          onChange={handleChange('description')}
          onBlur={handleBlur('description')}
          aria-invalid={!!errorFor('description')}
          rows={2}
        />
        {errorFor('description') && (
          <p className="field-error" role="alert">{errorFor('description')}</p>
        )}
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="task-priority">Priority</label>
          <select id="task-priority" value={values.priority} onChange={handleChange('priority')}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="task-due">Due date</label>
          <input
            id="task-due"
            type="date"
            value={values.dueDate}
            min={allowPast ? undefined : todayString()}
            onChange={handleChange('dueDate')}
            onBlur={handleBlur('dueDate')}
            aria-invalid={!!errorFor('dueDate')}
          />
          {errorFor('dueDate') && (
            <p className="field-error" role="alert">{errorFor('dueDate')}</p>
          )}
        </div>
      </div>

      <div className="form-buttons">
        <button type="submit">{isEditing ? 'Save changes' : 'Add Task'}</button>
        {isEditing && onCancel && (
          <button type="button" className="secondary-btn" onClick={onCancel}>Cancel</button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;