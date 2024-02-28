import { describe, expect, it } from "vitest";
import { createTask, tasksReducer } from "./tasksReducer.js";

// The reducer is a plain function: no React, no page. Give it tasks and an
// action, check what comes back.

function task(title, extra = {}) {
  return { ...createTask(title, "medium"), ...extra };
}

describe("tasksReducer", () => {
  it("adds a task to the front", () => {
    const old = task("Old");
    const added = task("New");
    const result = tasksReducer([old], { type: "added", task: added });
    expect(result).toEqual([added, old]);
  });

  it("toggles only the task with that id", () => {
    const a = task("A");
    const b = task("B");
    const result = tasksReducer([a, b], { type: "toggled", id: a.id });
    expect(result[0].done).toBe(true);
    expect(result[1]).toBe(b); // untouched: the very same object
  });

  it("edits only the fields it's given", () => {
    const a = task("A", { done: true });
    const [edited] = tasksReducer([a], { type: "edited", id: a.id, changes: { title: "A2" } });
    expect(edited).toEqual({ ...a, title: "A2" });
  });

  it("deletes a task", () => {
    const a = task("A");
    const b = task("B");
    expect(tasksReducer([a, b], { type: "deleted", id: a.id })).toEqual([b]);
  });

  it("clears completed tasks", () => {
    const a = task("A", { done: true });
    const b = task("B");
    expect(tasksReducer([a, b], { type: "cleared_completed" })).toEqual([b]);
  });

  it("never changes the array it was given", () => {
    const tasks = Object.freeze([Object.freeze(task("A"))]);
    // Frozen: any attempt to change them in place would throw
    expect(() => tasksReducer(tasks, { type: "toggled", id: tasks[0].id })).not.toThrow();
    expect(tasks[0].done).toBe(false);
  });

  it("throws on an unknown action, so typos fail loudly", () => {
    expect(() => tasksReducer([], { type: "toggle" })).toThrow("Unknown action: toggle");
  });
});

describe("createTask", () => {
  it("makes a new, not-done task with a unique id", () => {
    const a = createTask("Read", "high");
    const b = createTask("Read", "high");
    expect(a).toMatchObject({ title: "Read", priority: "high", done: false });
    expect(a.id).not.toBe(b.id);
  });
});
