import { useState } from 'react'
import TaskGenerator from './components/TaskGenerator'
import TaskFilter from './components/TaskFilter'
import TaskList from './components/TaskList'
import type { Task, TaskStatus } from './types'
import './App.css'

function App() {
  // 1. The master list of tasks lives here, so every child stays in sync.
    const [tasks, setTasks] = useState<Task[]>([])

  //2.The current filter choices reported by TaskFilter.
  const [filters, setFilters] = useState<{
    status?: TaskStatus;
    priority?: 'low' | 'medium' | 'high';
  }>({});

    // 3. Update one task's status (called from a TaskItem, via TaskList).
  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
  };

  // 4. Remove a task by its id.
  const handleDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // 5. Apply the filters. A missing filter means "don't filter by this".
  const visibleTasks = tasks.filter(
    (t) =>
      (!filters.status || t.status === filters.status) &&
      (!filters.priority || t.priority === filters.priority)
  );

  
  return (
    <>
    <div id= "header">
     <h1>🐍[up.graded]💚</h1>
     <h2>KanBan SideKick</h2> 
      </div>


   <div id= "task-generator">
      <TaskGenerator onTaskAdd={(newTask) => setTasks((prev) => [...prev, newTask])} />
      </div>

    <TaskFilter onFilterChange={setFilters} />

      <TaskList
        tasks={visibleTasks}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />
   
    </>
  )
} 

export default App
