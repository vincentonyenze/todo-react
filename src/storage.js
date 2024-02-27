// Saving to and loading from localStorage. Plain JavaScript, no React.
//
// localStorage only stores strings, so tasks go in as JSON. Anything read
// back is treated as UNTRUSTED: it may be from an older version of the
// app, edited by hand in DevTools, or cut off half-way. Bad data must
// never crash the app, so every task is checked and repaired or dropped.
//
// And localStorage itself can fail: it throws in some private windows,
// or when it's full. The app still works then, it just doesn't remember.

import { MAX_TITLE_LENGTH } from "./components/AddTaskForm.jsx";
import { DEFAULT_PRIORITY, PRIORITIES, SORT_OPTIONS } from "./priorities.js";

// The ".v1" is a version: if the shape of a task ever changes a lot, a new
// key starts fresh instead of misreading the old data
const TASKS_KEY = "todo-react.tasks.v1";
const SORT_KEY = "todo-react.sort";

const PRIORITY_VALUES = PRIORITIES.map((priority) => priority.value);
const SORT_VALUES = SORT_OPTIONS.map((option) => option.value);

// One stored task -> a clean task, or null if it can't be used
function cleanTask(value) {
  if (typeof value !== "object" || value === null) return null;
  if (typeof value.id !== "string" || value.id === "") return null;
  if (typeof value.title !== "string") return null;

  const title = value.title.trim().slice(0, MAX_TITLE_LENGTH);
  if (title === "") return null;

  return {
    id: value.id,
    title,
    // Tasks saved before priorities existed get the default
    priority: PRIORITY_VALUES.includes(value.priority) ? value.priority : DEFAULT_PRIORITY,
    done: value.done === true,
    createdAt: Number.isFinite(value.createdAt) ? value.createdAt : 0,
  };
}

export function loadTasks() {
  try {
    const parsed = JSON.parse(localStorage.getItem(TASKS_KEY));
    if (!Array.isArray(parsed)) return []; // nothing saved yet (null), or junk

    const tasks = parsed.map(cleanTask).filter(Boolean);
    // Two tasks with the same id would confuse React's keys: keep the first
    const seen = new Set();
    return tasks.filter((task) => !seen.has(task.id) && seen.add(task.id));
  } catch {
    return []; // storage blocked, or the JSON was broken
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch {
    // Full or blocked: keep going without saving
  }
}

export function loadSort() {
  try {
    const value = localStorage.getItem(SORT_KEY);
    return SORT_VALUES.includes(value) ? value : "newest";
  } catch {
    return "newest";
  }
}

export function saveSort(sortBy) {
  try {
    localStorage.setItem(SORT_KEY, sortBy);
  } catch {
    // Not important enough to complain about
  }
}
