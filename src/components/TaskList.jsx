import { useEffect, useRef } from "react";
import TaskItem from "./TaskItem.jsx";

// The list of tasks, or a friendly message when there are none.
// It passes each task, and the functions to change it, on to TaskItem.
//
// It also looks after focus when a row disappears under you: after a
// delete, or after ticking a task in the Active view (it moves to Done).
// Focus goes to the task that took its place (or the one above), or to
// `fallbackFocusRef` (the new-task box) when none are left.
//
// empty: { icon, text } to show when there are no tasks to list
function TaskList({ tasks, empty, onToggle, onEdit, onDelete, fallbackFocusRef }) {
  // Every task's checkbox element, by task id. A Map in a ref: it's
  // remembered between renders, and changing it doesn't cause a redraw.
  const checkboxes = useRef(new Map());
  // Where focus should go after the next change (a position in the list),
  // or null when there's nothing to do
  const focusAt = useRef(null);

  // Remember where the task was, then pass the change up to App
  function rememberPosition(id) {
    focusAt.current = tasks.findIndex((task) => task.id === id);
  }

  function handleDelete(id) {
    rememberPosition(id);
    onDelete(id);
  }

  // If the ticked task stays in view (the All view), the position still
  // points at its own checkbox, so focus simply stays where it was
  function handleToggle(id) {
    rememberPosition(id);
    onToggle(id);
  }

  // Runs after the list has been redrawn
  useEffect(() => {
    if (focusAt.current === null) return;
    const position = Math.min(focusAt.current, tasks.length - 1);
    focusAt.current = null;

    const next = tasks[position];
    if (next) checkboxes.current.get(next.id)?.focus();
    else fallbackFocusRef?.current?.focus();
  }, [tasks, fallbackFocusRef]);

  if (tasks.length === 0) {
    return (
      <div className="empty">
        <span className="empty__icon" aria-hidden="true">
          {empty.icon}
        </span>
        <p>{empty.text}</p>
      </div>
    );
  }

  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={handleToggle}
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
