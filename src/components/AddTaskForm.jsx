import { useState } from "react";
import "./AddTaskForm.css";

// Longest task title allowed (the input also stops at this length)
export const MAX_TITLE_LENGTH = 120;

// The box to type a new task, and the Add button.
//
// It doesn't keep a list of tasks: it just tells its parent "add this
// title" by calling onAdd(title). The parent owns the tasks.
function AddTaskForm({ onAdd }) {
  // A CONTROLLED input: React holds what's typed (in `title`), and the box
  // always shows exactly that. Every key press goes:
  //   type -> onChange -> setTitle(new text) -> React redraws the box
  // Because the value lives in state, the component can check it, trim it
  // or clear it whenever it likes.
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault(); // a form would otherwise reload the page

    const cleaned = title.trim();
    if (cleaned === "") {
      // Explain instead of silently doing nothing
      setError("Type a task first.");
      return;
    }

    onAdd(cleaned);
    setTitle(""); // ready for the next one (focus stays in the box)
    setError("");
  }

  function handleChange(event) {
    setTitle(event.target.value);
    if (error) setError(""); // the old error isn't about the new text
  }

  return (
    <form className="add-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="new-task" className="visually-hidden">
        New task
      </label>
      <input
        id="new-task"
        className="add-form__input"
        placeholder="What needs doing?"
        autoComplete="off"
        maxLength={MAX_TITLE_LENGTH}
        // These two lines are what make it "controlled"
        value={title}
        onChange={handleChange}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "new-task-error" : undefined}
      />
      <button type="submit" className="add-form__button">
        Add
      </button>
      {/* role="alert": read out the moment it appears */}
      {error && (
        <p id="new-task-error" className="add-form__error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

export default AddTaskForm;
