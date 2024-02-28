import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App.jsx";

// Tests that use the app like a person would: find things by their role
// and name (what a screen reader hears), type and click, check the result.
// They don't know about reducers, refs or state, so a refactor like Step 9
// can't break them, only a real change in behaviour can.
//
// user-event 14: start with userEvent.setup(), and AWAIT every action
// (P14's version 13 was synchronous)

function renderApp() {
  const user = userEvent.setup();
  const { unmount } = render(<App />);
  return { user, unmount };
}

// Type a task and press Enter, optionally choosing a priority first
async function addTask(user, title, priority) {
  if (priority) await user.selectOptions(screen.getByLabelText("Priority"), priority);
  await user.type(screen.getByLabelText("New task"), `${title}{Enter}`);
}

// The titles in the list, top to bottom
function taskTitles() {
  const list = screen.queryByRole("list");
  if (!list) return [];
  return within(list)
    .getAllByRole("checkbox")
    .map((checkbox) => checkbox.labels[0].textContent);
}

describe("adding tasks", () => {
  it("starts empty", () => {
    renderApp();
    expect(screen.getByText(/nothing to do yet/i)).toBeInTheDocument();
    expect(screen.getByText("No tasks")).toBeInTheDocument();
  });

  it("adds a task, newest first, and clears the box", async () => {
    const { user } = renderApp();
    await addTask(user, "Buy milk");
    await addTask(user, "Walk dog");

    expect(taskTitles()).toEqual(["Walk dog", "Buy milk"]);
    expect(screen.getByLabelText("New task")).toHaveValue("");
    expect(screen.getByLabelText("New task")).toHaveFocus();
  });

  it("explains instead of adding a blank task", async () => {
    const { user } = renderApp();
    await addTask(user, "   ");

    expect(screen.getByRole("alert")).toHaveTextContent("Type a task first.");
    expect(screen.getByLabelText("New task")).toHaveAttribute("aria-invalid", "true");
    expect(taskTitles()).toEqual([]);
  });

  it("shows the priority as a word", async () => {
    const { user } = renderApp();
    await addTask(user, "Pay rent", "high");
    expect(screen.getByText("High", { selector: ".priority" })).toBeInTheDocument();
  });
});

describe("ticking, filtering and clearing", () => {
  it("ticks a task and updates the counts", async () => {
    const { user } = renderApp();
    await addTask(user, "Buy milk");
    await addTask(user, "Walk dog");

    await user.click(screen.getByRole("checkbox", { name: "Buy milk" }));

    expect(screen.getByRole("checkbox", { name: "Buy milk" })).toBeChecked();
    expect(screen.getByText("1 of 2 done")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /active/i })).toHaveTextContent("1");
  });

  it("filters to active and done tasks", async () => {
    const { user } = renderApp();
    await addTask(user, "Buy milk");
    await addTask(user, "Walk dog");
    await user.click(screen.getByRole("checkbox", { name: "Buy milk" }));

    await user.click(screen.getByRole("button", { name: /active/i }));
    expect(screen.getByRole("button", { name: /active/i })).toHaveAttribute("aria-pressed", "true");
    expect(taskTitles()).toEqual(["Walk dog"]);

    await user.click(screen.getByRole("button", { name: /done/i }));
    expect(taskTitles()).toEqual(["Buy milk"]);
  });

  it("moves focus to the next task when a ticked one leaves the Active view", async () => {
    const { user } = renderApp();
    await addTask(user, "Buy milk");
    await addTask(user, "Walk dog");
    await user.click(screen.getByRole("button", { name: /active/i }));

    await user.click(screen.getByRole("checkbox", { name: "Walk dog" }));

    expect(taskTitles()).toEqual(["Buy milk"]);
    expect(screen.getByRole("checkbox", { name: "Buy milk" })).toHaveFocus();
  });

  it("switches to All when you add a task in the Done view", async () => {
    const { user } = renderApp();
    await addTask(user, "Buy milk");
    await user.click(screen.getByRole("button", { name: /done/i }));
    await addTask(user, "Walk dog");

    expect(screen.getByRole("button", { name: /all/i })).toHaveAttribute("aria-pressed", "true");
    expect(taskTitles()).toEqual(["Walk dog", "Buy milk"]);
  });

  it("asks before clearing completed tasks", async () => {
    const { user } = renderApp();
    await addTask(user, "Buy milk");
    await addTask(user, "Walk dog");
    await user.click(screen.getByRole("checkbox", { name: "Buy milk" }));

    await user.click(screen.getByRole("button", { name: "Clear completed" }));
    expect(screen.getByText("Delete 1 done task?")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "No" }));
    expect(taskTitles()).toEqual(["Walk dog", "Buy milk"]);

    await user.click(screen.getByRole("button", { name: "Clear completed" }));
    await user.click(screen.getByRole("button", { name: "Yes, delete" }));
    expect(taskTitles()).toEqual(["Walk dog"]);
    expect(screen.getByLabelText("New task")).toHaveFocus();
  });
});

describe("editing and deleting", () => {
  it("edits a title with Enter and returns focus to the Edit button", async () => {
    const { user } = renderApp();
    await addTask(user, "Buy milk");

    await user.click(screen.getByRole("button", { name: 'Edit "Buy milk"' }));
    const input = screen.getByLabelText("Edit task");
    expect(input).toHaveFocus();

    await user.clear(input);
    await user.type(input, "Buy oat milk{Enter}");

    expect(taskTitles()).toEqual(["Buy oat milk"]);
    expect(screen.getByRole("button", { name: 'Edit "Buy oat milk"' })).toHaveFocus();
  });

  it("cancels an edit with Escape", async () => {
    const { user } = renderApp();
    await addTask(user, "Buy milk");

    await user.click(screen.getByRole("button", { name: 'Edit "Buy milk"' }));
    await user.type(screen.getByLabelText("Edit task"), " and bread{Escape}");

    expect(taskTitles()).toEqual(["Buy milk"]);
  });

  it("won't save an empty title", async () => {
    const { user } = renderApp();
    await addTask(user, "Buy milk");

    await user.click(screen.getByRole("button", { name: 'Edit "Buy milk"' }));
    await user.clear(screen.getByLabelText("Edit task"));
    await user.keyboard("{Enter}");

    expect(screen.getByRole("alert")).toHaveTextContent("A task needs a title.");
    expect(screen.getByLabelText("Edit task")).toBeInTheDocument();
  });

  it("deletes a task and moves focus to the one that took its place", async () => {
    const { user } = renderApp();
    await addTask(user, "Buy milk");
    await addTask(user, "Walk dog");

    await user.click(screen.getByRole("button", { name: 'Delete "Walk dog"' }));

    expect(taskTitles()).toEqual(["Buy milk"]);
    expect(screen.getByRole("checkbox", { name: "Buy milk" })).toHaveFocus();
  });

  it("moves focus to the new-task box after deleting the last task", async () => {
    const { user } = renderApp();
    await addTask(user, "Buy milk");

    await user.click(screen.getByRole("button", { name: 'Delete "Buy milk"' }));

    expect(screen.getByText(/nothing to do yet/i)).toBeInTheDocument();
    expect(screen.getByLabelText("New task")).toHaveFocus();
  });
});

describe("sorting and saving", () => {
  it("sorts by priority", async () => {
    const { user } = renderApp();
    await addTask(user, "Water plants", "low");
    await addTask(user, "Pay rent", "high");
    await addTask(user, "Answer emails", "medium");

    await user.selectOptions(screen.getByLabelText("Sort by"), "priority");
    expect(taskTitles()).toEqual(["Pay rent", "Answer emails", "Water plants"]);
  });

  it("remembers tasks and the sort after a reload", async () => {
    const { user, unmount } = renderApp();
    await addTask(user, "Buy milk");
    await addTask(user, "Answer emails");
    await user.click(screen.getByRole("checkbox", { name: "Buy milk" }));
    await user.selectOptions(screen.getByLabelText("Sort by"), "title");

    // "Reload": take the app off the page and start a fresh one.
    // localStorage is kept, just like in a real browser.
    unmount();
    render(<App />);

    expect(taskTitles()).toEqual(["Answer emails", "Buy milk"]);
    expect(screen.getByRole("checkbox", { name: "Buy milk" })).toBeChecked();
    expect(screen.getByLabelText("Sort by")).toHaveValue("title");
  });
});
