// Every way the task list can change, in one place.
//
// A REDUCER is a plain function: (current state, action) -> next state.
//   - An ACTION is an object describing what happened, e.g.
//       { type: "toggled", id: "abc" }
//   - The reducer decides how the tasks change because of it.
// Components don't say HOW to change the tasks any more, only WHAT
// happened: dispatch({ type: "deleted", id }).
//
// Rules (the same as for every state update in React):
//   1. Don't change `tasks`: return a new array (map, filter, spread).
//   2. Be PURE: the same tasks + action always give the same result. No
//      random ids, no Date.now(), no focusing elements in here.
//      (That's why createTask is called BEFORE dispatching, not in here.)

// A new task. Each one gets a unique id that never changes: it's the
// React key, and how a task is found to tick it, edit it or delete it.
export function createTask(title, priority) {
  return {
    id: crypto.randomUUID(),
    title,
    priority,
    done: false,
    createdAt: Date.now(),
  };
}

export function tasksReducer(tasks, action) {
  switch (action.type) {
    case "added":
      // Newest first. A new array: tasks.push() would change the old one,
      // and React would never notice.
      return [action.task, ...tasks];

    case "toggled":
      // A NEW object for the task that changed, the same objects for the rest
      return tasks.map((task) => (task.id === action.id ? { ...task, done: !task.done } : task));

    case "edited":
      // action.changes: the fields to update, e.g. { title, priority }.
      // Spreading them after ...task means they win over the old values.
      return tasks.map((task) => (task.id === action.id ? { ...task, ...action.changes } : task));

    case "deleted":
      return tasks.filter((task) => task.id !== action.id);

    case "cleared_completed":
      return tasks.filter((task) => !task.done);

    default:
      // A typo like "toggle" instead of "toggled" fails loudly, instead of
      // the click silently doing nothing
      throw new Error(`Unknown action: ${action.type}`);
  }
}
