import { describe, expect, it } from "vitest";
import { countTasks, filterTasks } from "./filters.js";
import { sortTasks } from "./priorities.js";

// Small fixed tasks, so every expected order can be worked out by hand
const tasks = [
  { id: "1", title: "banana", priority: "low", done: false, createdAt: 1 },
  { id: "2", title: "Apple", priority: "high", done: true, createdAt: 2 },
  { id: "3", title: "cherry", priority: "high", done: false, createdAt: 3 },
  { id: "4", title: "apple pie", priority: "medium", done: false, createdAt: 4 },
];
const titles = (list) => list.map((task) => task.title);

describe("sortTasks", () => {
  it.each([
    ["newest", ["apple pie", "cherry", "Apple", "banana"]],
    ["oldest", ["banana", "Apple", "cherry", "apple pie"]],
    // High first; within High, newest first
    ["priority", ["cherry", "Apple", "apple pie", "banana"]],
    // Capital letters don't jump ahead of small ones
    ["title", ["Apple", "apple pie", "banana", "cherry"]],
  ])("sorts by %s", (sortBy, expected) => {
    expect(titles(sortTasks(tasks, sortBy))).toEqual(expected);
  });

  it("returns a copy and leaves the original order alone", () => {
    const sorted = sortTasks(tasks, "title");
    expect(sorted).not.toBe(tasks);
    expect(titles(tasks)).toEqual(["banana", "Apple", "cherry", "apple pie"]);
  });

  it("falls back to newest first for an unknown sort", () => {
    expect(titles(sortTasks(tasks, "nonsense"))).toEqual(titles(sortTasks(tasks, "newest")));
  });
});

describe("filterTasks and countTasks", () => {
  it("shows the right tasks for each filter", () => {
    expect(filterTasks(tasks, "all")).toHaveLength(4);
    expect(titles(filterTasks(tasks, "active"))).toEqual(["banana", "cherry", "apple pie"]);
    expect(titles(filterTasks(tasks, "done"))).toEqual(["Apple"]);
  });

  it("counts every filter at once", () => {
    expect(countTasks(tasks)).toEqual({ all: 4, active: 3, done: 1 });
    expect(countTasks([])).toEqual({ all: 0, active: 0, done: 0 });
  });
});
