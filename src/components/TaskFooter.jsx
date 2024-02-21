import { useState } from "react";
import "./TaskFooter.css";

// The bottom of the card: how many tasks are done, and "Clear completed".
//
// Clearing several tasks at once can't be undone, so it asks first. Not
// with the browser's confirm() popup (it blocks the whole page and can't
// be styled), but by swapping the button for "Delete 3 done tasks? Yes / No".
function TaskFooter({ total, doneCount, onClearCompleted }) {
  const [confirming, setConfirming] = useState(false);

  // Nothing done any more (e.g. one was unticked): stop asking. Changing
  // state while drawing like this is allowed when it's guarded by a
  // condition, so it can't repeat forever.
  if (confirming && doneCount === 0) setConfirming(false);

  function clear() {
    onClearCompleted();
    setConfirming(false);
  }

  return (
    <footer className="todo-card__section todo-card__footer">
      {/* aria-live: screen readers hear the new count when a task is ticked */}
      <p aria-live="polite">{total === 0 ? "No tasks" : `${doneCount} of ${total} done`}</p>

      {doneCount > 0 &&
        (confirming ? (
          <div className="confirm" role="group" aria-label="Confirm clearing">
            <span>
              Delete {doneCount} done task{doneCount === 1 ? "" : "s"}?
            </span>
            {/* autoFocus: move straight to the choice, so a keyboard user
                isn't left on a button that just disappeared */}
            <button type="button" className="link-btn link-btn--danger" onClick={clear} autoFocus>
              Yes, delete
            </button>
            <button type="button" className="link-btn" onClick={() => setConfirming(false)}>
              No
            </button>
          </div>
        ) : (
          <button type="button" className="link-btn" onClick={() => setConfirming(true)}>
            Clear completed
          </button>
        ))}
    </footer>
  );
}

export default TaskFooter;
