// Date helpers. Due dates are stored as 'YYYY-MM-DD' strings (what <input type="date"> gives us).

const pad = (n: number) => String(n).padStart(2, '0');

// Today's date as 'YYYY-MM-DD' in the user's local time zone.
export const todayString = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// True if the string looks like a real calendar date, e.g. '2026-11-01'.
export const isValidDateString = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;
};

// '2026-11-01' -> 'Nov 1, 2026'. Built from the parts so time zones can't shift the day.
export const formatDate = (value: string): string => {
  if (!isValidDateString(value)) return '';
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

// A task is overdue when it has a due date in the past and isn't completed.
export const isOverdue = (dueDate: string, completed: boolean): boolean =>
  dueDate !== '' && !completed && dueDate < todayString();