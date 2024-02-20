import TaskItem from "./TaskItem.jsx";

// The list of tasks, or a friendly message when there are none.
// It passes each task, and the functions to change it, on to TaskItem.
function TaskList({ tasks, onToggle }) {
  if (tasks.length === 0) {
    return (
      <div className="empty">
        <span className="empty__icon" aria-hidden="true">
          🎉
        </span>
        <p>Nothing to do yet. Add your first task above.</p>
      </div>
    );
  }

  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} />
      ))}
    </ul>
  );
}

export default TaskList;
