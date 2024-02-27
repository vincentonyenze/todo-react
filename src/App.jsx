import { useEffect, useReducer, useRef, useState } from "react";
import AddTaskForm from "./components/AddTaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import TaskFooter from "./components/TaskFooter.jsx";
import FilterTabs from "./components/FilterTabs.jsx";
import { countTasks, emptyMessage, filterTasks } from "./filters.js";
import { SORT_OPTIONS, sortTasks } from "./priorities.js";
import { createTask, tasksReducer } from "./tasksReducer.js";
import { loadSort, loadTasks, saveSort, saveTasks } from "./storage.js";

// "Tuesday, October 20": today's date, worked out once when the page loads
const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

function App() {
  // useReducer instead of useState: the same tasks, but every change goes
  // through tasksReducer. You get back the state and a `dispatch` function
  // to send it actions.
  //
  // The third argument, loadTasks, is a LAZY INITIALISER: React calls it
  // once, on the first render, to get the starting tasks. Writing
  // useReducer(tasksReducer, loadTasks()) would also work, but would read
  // and parse localStorage on EVERY render, then throw the result away.
  const [tasks, dispatch] = useReducer(tasksReducer, null, loadTasks);
  // HOW to show the tasks is separate state from the tasks themselves.
  // Changing it never touches the tasks: what's on screen is worked out
  // from all three on every render (see visibleTasks below).
  // useState has the same trick: pass the FUNCTION (loadSort), not its
  // result (loadSort()), and it only runs once
  const [sortBy, setSortBy] = useState(loadSort);
  const [filter, setFilter] = useState("all"); // "all" | "active" | "done"

  // The new-task text box, so focus can be sent back there when the list
  // empties or completed tasks are cleared
  const newTaskInput = useRef(null);

  // SYNCING WITH THE OUTSIDE WORLD. localStorage isn't part of React, so
  // keeping it up to date is a job for an effect: after every render where
  // `tasks` changed (added, ticked, edited, deleted...), save them.
  // One effect covers every kind of change, so no handler can forget to.
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveSort(sortBy);
  }, [sortBy]);

  // The handlers are now one line each: say what happened, and let the
  // reducer work out the new tasks. Things that aren't about the tasks
  // themselves (the filter, focus) still happen here.

  function addTask(title, priority) {
    dispatch({ type: "added", task: createTask(title, priority) });
    // A new task isn't done, so in the Done view it would vanish the moment
    // you added it. Show it instead. (Two state updates in one event: React
    // does them together, in a single redraw.)
    if (filter === "done") setFilter("all");
  }

  function toggleTask(id) {
    dispatch({ type: "toggled", id });
  }

  function editTask(id, changes) {
    dispatch({ type: "edited", id, changes });
  }

  function deleteTask(id) {
    dispatch({ type: "deleted", id });
  }

  function clearCompleted() {
    dispatch({ type: "cleared_completed" });
    // The Yes button you pressed is gone: continue from the new-task box
    newTaskInput.current.focus();
  }

  // DERIVED: worked out from state on every render, never stored.
  //   tasks + filter + sortBy  ->  the tasks you see, in order
  // If visibleTasks were its own state, every add, tick, edit and delete
  // would have to update it too, and one day they'd disagree.
  const counts = countTasks(tasks);
  const visibleTasks = sortTasks(filterTasks(tasks, filter), sortBy);

  return (
    <div className="app">
      <header className="app__header">
        <p className="app__date">{today}</p>
        <h1 className="app__title">My tasks</h1>
      </header>

      <main className="todo-card">
        <section className="todo-card__section" aria-label="Add a task">
          {/* Passing a function down: the form calls onAdd, App adds the task */}
          <AddTaskForm onAdd={addTask} inputRef={newTaskInput} />
        </section>

        <section className="todo-card__section" aria-label="Tasks">
          {tasks.length > 0 && (
            <div className="toolbar">
              <FilterTabs filter={filter} counts={counts} onChange={setFilter} />
              {/* Sorting one task would do nothing, so only show it for two+ */}
              {tasks.length > 1 && (
                <div className="toolbar__sort">
                  <label htmlFor="sort-by">Sort by</label>
                  <select
                    id="sort-by"
                    className="select"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
          <TaskList
            tasks={visibleTasks}
            empty={emptyMessage(filter, tasks.length)}
            onToggle={toggleTask}
            onEdit={editTask}
            onDelete={deleteTask}
            fallbackFocusRef={newTaskInput}
          />
        </section>

        <TaskFooter total={counts.all} doneCount={counts.done} onClearCompleted={clearCompleted} />
      </main>

      <p className="app__footer">Built with React and Vite</p>
    </div>
  );
}

export default App;
