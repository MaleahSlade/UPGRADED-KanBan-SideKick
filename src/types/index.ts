

// The three stages a task can be in.
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

// How urgent a task is.
export type Priority = 'low' | 'medium' | 'high';

// The ways the task list can be sorted.
export type SortOption = 'created' | 'dueDate' | 'priority' | 'status' | 'title';

// One task on the Kanban board. Every task has all of these fields.
export interface Task {
  id: string;          // Unique ID, used to find the right task to update or delete
  title: string;       // Short name shown on the card
  description: string; // Longer details about the task
  status: TaskStatus;  // Which column the task is in
  priority: Priority;  // How urgent it is
  dueDate: string;     // When it's due, as 'YYYY-MM-DD' (empty string = no due date)
}



// The values the user types into the task form.
export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
}

// Validation messages: at most one message per form field.
// An empty object means the form is valid.
export type TaskFormErrors = Partial<Record<keyof TaskFormData, string>>;



// Everything TaskFilter can narrow the list by.
// An empty search string or a missing status/priority means "don't filter by that".
export interface TaskFilters {
  search: string;       // Text to look for in the title or description
  status?: TaskStatus;  // Only show tasks with this status
  priority?: Priority;  // Only show tasks with this priority
}

// Summary numbers shown on the dashboard.
export interface TaskStatistics {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  completionRate: number; // Whole-number percentage, 0-100
}



// Props for TaskList: the component that shows all the tasks.
export interface TaskListProps {
  tasks: Task[]; // The tasks to display (already filtered and sorted)
  sort: SortOption;                         // The current sort choice
  onSortChange: (sort: SortOption) => void; // Called when the user picks a new sort
  // Called when a task's status changes. Passes up WHICH task and its NEW status.
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  // Called when a task is deleted. Passes up WHICH task to remove.
  onDelete: (taskId: string) => void;
  // Called when the user clicks Edit on a task. Passes up WHICH task to edit.
  onEdit: (taskId: string) => void;
}

// Props for TaskItem: the component that shows one task card.
export interface TaskItemProps {
  task: Task; // The single task this card displays
  // Called when the user changes this card's status (e.g. from a dropdown)
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  // Called when the user clicks this card's delete button
  onDelete: (taskId: string) => void;
  // Called when the user clicks this card's edit button
  onEdit: (taskId: string) => void;
}

// Props for TaskFilter: the controls that narrow down which tasks are shown.
export interface TaskFilterProps {
  filters: TaskFilters; // The current filter values (owned by the parent)
  // Called whenever the user changes a filter. Passes up the full, updated filters.
  onFilterChange: (filters: TaskFilters) => void;
}

// Props for TaskForm: the form that adds a new task or edits an existing one.
export interface TaskFormProps {
  editingTask?: Task | null;              // If set, the form edits this task
  onSubmit: (data: TaskFormData) => void; // Called with the validated form data
  onCancel?: () => void;                  // Called when the user cancels editing
}

// Props for TaskStats: the summary numbers on the dashboard.
export interface TaskStatsProps {
  stats: TaskStatistics;
}