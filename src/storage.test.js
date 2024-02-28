import { describe, expect, it, vi } from "vitest";
import { loadSort, loadTasks, saveTasks } from "./storage.js";

// jsdom gives tests a real-looking localStorage (emptied after each test
// in src/test/setup.js)
const KEY = "todo-react.tasks.v1";

describe("loadTasks", () => {
  it("returns an empty list when nothing is saved", () => {
    expect(loadTasks()).toEqual([]);
  });

  it("gets back exactly what was saved", () => {
    const tasks = [{ id: "a", title: "Read", priority: "high", done: true, createdAt: 10 }];
    saveTasks(tasks);
    expect(loadTasks()).toEqual(tasks);
  });

  it("survives broken JSON and data that isn't a list", () => {
    localStorage.setItem(KEY, '[{"id":"a","title":"half');
    expect(loadTasks()).toEqual([]);
    localStorage.setItem(KEY, '{"hello":1}');
    expect(loadTasks()).toEqual([]);
  });

  it("repairs what it can and drops what it can't", () => {
    localStorage.setItem(
      KEY,
      JSON.stringify([
        { id: "1", title: "  Trim me  ", priority: "high", done: true, createdAt: 5 },
        { id: "2", title: "No priority" },
        { id: "3", title: "   " }, // blank title
        { title: "No id" },
        null,
        "a string",
        { id: "1", title: "Same id again" },
        { id: "4", title: "Odd values", priority: "urgent", done: "yes", createdAt: "soon" },
      ])
    );

    expect(loadTasks()).toEqual([
      { id: "1", title: "Trim me", priority: "high", done: true, createdAt: 5 },
      { id: "2", title: "No priority", priority: "medium", done: false, createdAt: 0 },
      { id: "4", title: "Odd values", priority: "medium", done: false, createdAt: 0 },
    ]);
  });

  it("returns an empty list when storage is blocked", () => {
    // vi.spyOn replaces a method for this test only
    const spy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    expect(loadTasks()).toEqual([]);
    spy.mockRestore();
  });
});

describe("saveTasks", () => {
  it("doesn't crash when storage is full", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    expect(() => saveTasks([])).not.toThrow();
    spy.mockRestore();
  });
});

describe("loadSort", () => {
  it("only accepts known sort options", () => {
    expect(loadSort()).toBe("newest");
    localStorage.setItem("todo-react.sort", "title");
    expect(loadSort()).toBe("title");
    localStorage.setItem("todo-react.sort", "nonsense");
    expect(loadSort()).toBe("newest");
  });
});
