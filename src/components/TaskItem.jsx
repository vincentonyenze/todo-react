import { useEffect, useRef, useState } from "react";
import { MAX_TITLE_LENGTH } from "./AddTaskForm.jsx";
import "./TaskItem.css";

// One task: a checkbox, its title, and buttons to edit or delete it.
// Nothing changes here: it asks the parent by calling onToggle(id),
// onEdit(id, title) or onDelete(id). App owns the tasks.
//
// checkboxRef: lets the list move focus to this task's checkbox (after
// the task above it is deleted)
function TaskItem({ task, onToggle, onEdit, onDelete, checkboxRef }) {
  // Editing is something only THIS row cares about, so the state is here
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.title); // the text while editing
  const [error, setError] = useState("");

  // REFS: a way to reach a real element on the page (to focus it), or to
  // remember a value WITHOUT causing a redraw when it changes.
  //   useRef(null) gives an object { current: null }; React puts the
  //   element in .current once it's on the page (via ref={...}).
  const editInputRef = useRef(null);
  const editButtonRef = useRef(null);
  const wasEditing = useRef(false); // remembered between renders, not drawn

  // EFFECTS run AFTER React has updated the page, so the elements exist.
  // This one runs whenever isEditing changes (the list at the end), to move
  // focus where it belongs:
  //   started editing -> into the text box, with the text selected
  //   stopped editing -> back to the Edit button you started from
  // Without it, the box you were typing in disappears and focus is lost.
  useEffect(() => {
    if (isEditing) {
      editInputRef.current.focus();
      editInputRef.current.select();
    } else if (wasEditing.current) {
      editButtonRef.current.focus();
    }
    wasEditing.current = isEditing;
  }, [isEditing]);

  const checkboxId = `task-${task.id}`;
  const errorId = `task-${task.id}-error`;

  function startEditing() {
    setDraft(task.title); // start from the current title
    setError("");
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
  }

  function saveEdit(event) {
    event.preventDefault();
    const cleaned = draft.trim();
    if (cleaned === "") {
      setError("A task needs a title. (Use 🗑 to delete it.)");
      return;
    }
    if (cleaned !== task.title) onEdit(task.id, cleaned);
    setIsEditing(false);
  }

  // Escape anywhere in the edit form cancels, like closing a dialog
  function handleEditKeyDown(event) {
    if (event.key === "Escape") cancelEditing();
  }

  if (isEditing) {
    return (
      <li className="task task--editing">
        <form className="task__edit" onSubmit={saveEdit} onKeyDown={handleEditKeyDown} noValidate>
          <label htmlFor={`${checkboxId}-edit`} className="visually-hidden">
            Edit task
          </label>
          <input
            ref={editInputRef}
            id={`${checkboxId}-edit`}
            className="task__edit-input"
            value={draft}
            maxLength={MAX_TITLE_LENGTH}
            onChange={(event) => {
              setDraft(event.target.value);
              if (error) setError("");
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
          />
          <button type="submit" className="task__save">
            Save
          </button>
          <button type="button" className="task__cancel" onClick={cancelEditing}>
            Cancel
          </button>
          {error && (
            <p id={errorId} className="task__error" role="alert">
              {error}
            </p>
          )}
        </form>
      </li>
    );
  }

  return (
    <li className={task.done ? "task task--done" : "task"}>
      <input
        ref={checkboxRef}
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

      {/* The labels name the task, so a screen reader user tabbing
          through hears WHICH one each button is for */}
      <button
        ref={editButtonRef}
        type="button"
        className="task__action"
        aria-label={`Edit "${task.title}"`}
        title="Edit"
        onClick={startEditing}
      >
        <span aria-hidden="true">✏️</span>
      </button>
      <button
        type="button"
        className="task__action task__action--danger"
        aria-label={`Delete "${task.title}"`}
        title="Delete"
        onClick={() => onDelete(task.id)}
      >
        <span aria-hidden="true">🗑</span>
      </button>
    </li>
  );
}

export default TaskItem;
