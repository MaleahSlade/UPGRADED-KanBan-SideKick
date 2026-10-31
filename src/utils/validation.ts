// Form validation helpers.

import type { TaskFormData, TaskFormErrors } from '../types';
import { isValidDateString, todayString } from './dates';

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 200;

// Check the form values and return a message for each invalid field.
// An empty object means the form is valid.
// `allowPastDate` lets an existing task keep a due date that has already passed.
export const validateTaskForm = (
  data: TaskFormData,
  allowPastDate = false,
): TaskFormErrors => {
  const errors: TaskFormErrors = {};
  const title = data.title.trim();

  if (title === '') {
    errors.title = 'Title is required.';
  } else if (title.length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  } else if (title.length > TITLE_MAX) {
    errors.title = `Title must be ${TITLE_MAX} characters or fewer.`;
  }

  if (data.description.trim().length > DESCRIPTION_MAX) {
    errors.description = `Description must be ${DESCRIPTION_MAX} characters or fewer.`;
  }

  if (data.dueDate !== '') {
    if (!isValidDateString(data.dueDate)) {
      errors.dueDate = 'Enter a valid date.';
    } else if (!allowPastDate && data.dueDate < todayString()) {
      errors.dueDate = 'Due date cannot be in the past.';
    }
  }

  return errors;
};

// True when there are no errors.
export const isFormValid = (errors: TaskFormErrors): boolean => Object.keys(errors).length === 0;