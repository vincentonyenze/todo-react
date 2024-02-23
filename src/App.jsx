import { useRef, useState } from "react";
import AddTaskForm from "./components/AddTaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import TaskFooter from "./components/TaskFooter.jsx";
import { SORT_OPTIONS, sortTasks } from "./priorities.js";

// "Tuesday, October 20": today's date, worked out once when the page loads
const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

// A new task. Each one gets a unique id that never changes: it's the
// React key, and how a task is found to tick it, edit it or delete it.
function createTask(title, priority) {
  return {
    id: crypto.randomUUID(),
    title,
    priority,
    done: false,
    createdAt: Date.now(),
  };
}

function App() {
  // The tasks live HERE, in the component at the top. Components further
  // down (the form, and soon the list) get what they need through props.
  const [tasks, setTasks] = useState([]);
  // HOW to show the tasks is separate state from the tasks themselves.
  // Changing it never touches the tasks: the order on screen is worked
  // out from both on every render (see sortedTasks below).
  const [sortBy, setSortBy] = useState("newest");

  // The new-task text box, so focus can be sent back there when the list
  // empties or completed tasks are cleared
  const newTaskInput = useRef(null);

  function addTask(title, priority) {
    // A NEW array with the new task first. React only notices a change if
    // the state is a different array; tasks.push() would change the old
    // one in place, and React would never redraw.
    //
    // (current) => ... is the "updater" form: React passes in the latest
    // tasks, which is always safe, even if several updates happen at once.
    setTasks((current) => [createTask(title, priority), ...current]);
  }

  function toggleTask(id) {
    // map() makes a new array: a NEW object for the task that changed
    // ({ ...task, done: !task.done }), and the same objects for the rest
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, done: !task.done } : task))
    );
  }

  // changes: the fields to update, e.g. { title: "New", priority: "high" }.
  // Spreading them after ...task means they win over the old values.
  function editTask(id, changes) {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, ...changes } : task)));
  }

  function deleteTask(id) {
    // filter() keeps every task EXCEPT this one, in a new array
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  function clearCompleted() {
    setTasks((current) => current.filter((task) => !task.done));
    // The Yes button you pressed is gone: continue from the new-task box
    newTaskInput.current.focus();
  }

  // Worked out from the tasks on every render, never stored
  const doneCount = tasks.filter((task) => task.done).length;
  const sortedTasks = sortTasks(tasks, sortBy);

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
          {/* Sorting one task would do nothing, so only show it for two+ */}
          {tasks.length > 1 && (
            <div className="toolbar">
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
          <TaskList
            tasks={sortedTasks}
            onToggle={toggleTask}
            onEdit={editTask}
            onDelete={deleteTask}
            fallbackFocusRef={newTaskInput}
          />
        </section>

        <TaskFooter total={tasks.length} doneCount={doneCount} onClearCompleted={clearCompleted} />
      </main>

      <p className="app__footer">Built with React and Vite</p>
    </div>
  );
}

export default App;
