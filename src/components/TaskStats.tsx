// Purpose: Shows summary numbers for all tasks (not just the filtered ones).
// Props:
//   stats - totals by status, number overdue, and completion percentage

import type { TaskStatsProps } from '../types';

const TaskStats = ({ stats }: TaskStatsProps) => (
  <section className="task-stats" aria-label="Task statistics">
    <div className="stat">
      <span className="stat-number">{stats.total}</span>
      <span>Total</span>
    </div>

    <div className="stat stat-pending">
      <span className="stat-number">{stats.pending}</span>
      <span>Pending</span>
    </div>

    <div className="stat stat-progress">
      <span className="stat-number">{stats.inProgress}</span>
      <span>In progress</span>
    </div>

    <div className="stat stat-done">
      <span className="stat-number">{stats.completed}</span>
      <span>Completed</span>
    </div>

    <div className="stat stat-overdue">
      <span className="stat-number">{stats.overdue}</span>
      <span>Overdue</span>
    </div>

    <div className="stat">
      <span className="stat-number">{stats.completionRate}%</span>
      <span>Done</span>
      <div
        className="progress"
        role="progressbar"
        aria-valuenow={stats.completionRate}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="progress-fill" style={{ width: `${stats.completionRate}%` }} />
      </div>
    </div>
  </section>
);

export default TaskStats;