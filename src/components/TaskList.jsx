import { useEffect, useRef } from "react";
import TaskItem from "./TaskItem.jsx";

// The list of tasks, or a friendly message when there are none.
// It passes each task, and the functions to change it, on to TaskItem.
//
// It also looks after focus when a task is deleted: the 🗑 you pressed is
// gone, so focus moves to the task that took its place (or the one above),
// or to `fallbackFocusRef` (the new-task box) when none are left.
function TaskList({ tasks, onToggle, onEdit, onDelete, fallbackFocusRef }) {
  // Every task's checkbox element, by task id. A Map in a ref: it's
  // remembered between renders, and changing it doesn't cause a redraw.
  const checkboxes = useRef(new Map());
  // Where focus should go after the next delete (a position in the list),
  // or null when there's nothing to do
  const focusAfterDelete = useRef(null);

  function handleDelete(id) {
    focusAfterDelete.current = tasks.findIndex((task) => task.id === id);
    onDelete(id);
  }

  // Runs after the list has been redrawn without the deleted task
  useEffect(() => {
    if (focusAfterDelete.current === null) return;
    const position = Math.min(focusAfterDelete.current, tasks.length - 1);
    focusAfterDelete.current = null;

    const next = tasks[position];
    if (next) checkboxes.current.get(next.id)?.focus();
    else fallbackFocusRef?.current?.focus();
  }, [tasks, fallbackFocusRef]);

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
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={handleDelete}
          // A "callback ref": React calls it with the element when it
          // appears, and calls the function it returns when it goes
          checkboxRef={(element) => {
            checkboxes.current.set(task.id, element);
            return () => checkboxes.current.delete(task.id);
          }}
        />
      ))}
    </ul>
  );
}

export default TaskList;
