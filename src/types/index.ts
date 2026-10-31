// The three stages a task can be in.
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

// One task on the Kanban board. Every task has all of these fields.
export interface Task {
  id: string;          // Unique ID, used to find the right task to update or delete
  title: string;       // Short name shown on the card
  description: string; // Longer details about the task
  status: TaskStatus;  // Which column the task is in
  priority: 'low' | 'medium' | 'high'; // How urgent it is
  dueDate: string;     // When it's due (e.g. '2026-11-01')
}

// Props for TaskList: the component that shows all the tasks.
export interface TaskListProps {
  tasks: Task[]; // The tasks to display. TaskList loops over them and renders one TaskItem each
  // Called when a task's status changes. Passes up WHICH task and its NEW status.
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  // Called when a task is deleted. Passes up WHICH task to remove.
  onDelete: (taskId: string) => void;
}

// Props for TaskItem: the component that shows one task card.
export interface TaskItemProps {
  task: Task; // The single task this card displays
  // Called when the user changes this card's status (e.g. from a dropdown)
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  // Called when the user clicks this card's delete button
  onDelete: (taskId: string) => void;
}

// Props for TaskFilter: the controls that narrow down which tasks are shown.
export interface TaskFilterProps {
  // Called whenever the user changes a filter. Passes up the current choices.
  // Both are optional: leaving one out means "don't filter by that".
  onFilterChange: (filters: {
    status?: TaskStatus;                  // Only show tasks with this status
    priority?: 'low' | 'medium' | 'high'; // Only show tasks with this priority
  }) => void;
}

// Props for TaskGenerator: the form that creates new tasks.
export interface TaskGeneratorProps {
  // Called with the finished task when the user submits the form.
  onTaskAdd: (task: Task) => void;
}