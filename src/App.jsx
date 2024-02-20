import { useState } from "react";
import AddTaskForm from "./components/AddTaskForm.jsx";

// "Tuesday, October 20": today's date, worked out once when the page loads
const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

// A new task. Each one gets a unique id that never changes: it's the
// React key, and how a task is found to tick it, edit it or delete it.
function createTask(title) {
  return {
    id: crypto.randomUUID(),
    title,
    done: false,
    createdAt: Date.now(),
  };
}

function App() {
  // The tasks live HERE, in the component at the top. Components further
  // down (the form, and soon the list) get what they need through props.
  const [tasks, setTasks] = useState([]);

  function addTask(title) {
    // A NEW array with the new task first. React only notices a change if
    // the state is a different array; tasks.push() would change the old
    // one in place, and React would never redraw.
    //
    // (current) => ... is the "updater" form: React passes in the latest
    // tasks, which is always safe, even if several updates happen at once.
    setTasks((current) => [createTask(title), ...current]);
  }

  return (
    <div className="app">
      <header className="app__header">
        <p className="app__date">{today}</p>
        <h1 className="app__title">My tasks</h1>
      </header>

      <main className="todo-card">
        <section className="todo-card__section" aria-label="Add a task">
          {/* Passing a function down: the form calls onAdd, App adds the task */}
          <AddTaskForm onAdd={addTask} />
        </section>

        <section className="todo-card__section" aria-label="Tasks">
          {tasks.length === 0 ? (
            <div className="empty">
              <span className="empty__icon" aria-hidden="true">
                🎉
              </span>
              <p>Nothing to do yet. Add your first task above.</p>
            </div>
          ) : (
            // A plain list for now; Step 4 turns each one into a real task
            <ul>
              {tasks.map((task) => (
                <li key={task.id}>{task.title}</li>
              ))}
            </ul>
          )}
        </section>

        <footer className="todo-card__section todo-card__footer">
          {/* Worked out from the tasks every time: never stored, never stale */}
          <p>
            {tasks.length} task{tasks.length === 1 ? "" : "s"}
          </p>
        </footer>
      </main>

      <p className="app__footer">Built with React and Vite</p>
    </div>
  );
}

export default App;
