import "./TaskItem.css";

// One task: a checkbox and its title. Ticking it doesn't change anything
// here. It asks the parent to by calling onToggle(id). TaskItem only SHOWS
// a task; App owns the tasks and decides how they change.
function TaskItem({ task, onToggle }) {
  // The checkbox's id is built from the task's id, so every row's label
  // points at its own checkbox
  const checkboxId = `task-${task.id}`;

  return (
    <li className={task.done ? "task task--done" : "task"}>
      <input
        type="checkbox"
        id={checkboxId}
        className="task__checkbox"
        // Controlled, like the text box: the box shows task.done, and a
        // click asks for a change instead of changing it directly
        checked={task.done}
        onChange={() => onToggle(task.id)}
      />
      {/* The title IS the checkbox's label: click it to tick the task,
          and screen readers hear "Buy groceries, checkbox, checked" */}
      <label htmlFor={checkboxId} className="task__title">
        {task.title}
      </label>
    </li>
  );
}

export default TaskItem;
