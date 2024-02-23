// Plain JavaScript, no React: the priority levels and the ways to sort.
// Keeping it out of the components means any of them can use it, and it
// can be tested on its own (Step 11).

// The order here is the order they appear in the menus
export const PRIORITIES = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export const DEFAULT_PRIORITY = "medium";

// For sorting: a smaller number comes first
const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

export function priorityLabel(value) {
  return PRIORITIES.find((priority) => priority.value === value)?.label ?? value;
}

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "priority", label: "Priority" },
  { value: "title", label: "A to Z" },
];

// Compare functions for Array sort: return a negative number if a comes
// first, a positive number if b comes first, 0 if it doesn't matter
const newestFirst = (a, b) => b.createdAt - a.createdAt;

const COMPARE = {
  newest: newestFirst,
  oldest: (a, b) => a.createdAt - b.createdAt,
  // High first; tasks with the same priority stay newest first
  priority: (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority] || newestFirst(a, b),
  // localeCompare sorts like a person would: "apple" next to "Apple",
  // and "é" next to "e" (a plain < puts every capital before every small letter)
  title: (a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: "base" }),
};

// A NEW sorted array. The tasks passed in are left exactly as they were.
//   tasks.sort()     sorts the array IN PLACE: if that array is React
//                    state, you've changed state behind React's back
//   tasks.toSorted() returns a sorted copy, which is safe
export function sortTasks(tasks, sortBy) {
  return tasks.toSorted(COMPARE[sortBy] ?? newestFirst);
}
