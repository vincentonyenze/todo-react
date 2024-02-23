// Plain JavaScript, no React: which tasks each filter shows.

export const FILTERS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "done", label: "Done" },
];

// One test per filter: does this task belong in it?
const MATCHES = {
  all: () => true,
  active: (task) => !task.done,
  done: (task) => task.done,
};

// A new array with only the tasks the filter shows
export function filterTasks(tasks, filter) {
  return tasks.filter(MATCHES[filter] ?? MATCHES.all);
}

// How many tasks each filter would show: { all: 5, active: 3, done: 2 }
export function countTasks(tasks) {
  const done = tasks.filter(MATCHES.done).length;
  return { all: tasks.length, active: tasks.length - done, done };
}

// What to say when a filter shows nothing
export function emptyMessage(filter, total) {
  if (total === 0) return { icon: "🎉", text: "Nothing to do yet. Add your first task above." };
  if (filter === "active") return { icon: "✅", text: "All done! Nothing left to do." };
  if (filter === "done") return { icon: "🌱", text: "Nothing finished yet. Tick a task when it's done." };
  return { icon: "🎉", text: "Nothing here." };
}
