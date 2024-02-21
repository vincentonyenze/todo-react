import { useState } from "react";
import AddTaskForm from "./components/AddTaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import TaskFooter from "./components/TaskFooter.jsx";

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

  function toggleTask(id) {
    // map() makes a new array: a NEW object for the task that changed
    // ({ ...task, done: !task.done }), and the same objects for the rest
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, done: !task.done } : task))
    );
  }

  function deleteTask(id) {
    // filter() keeps every task EXCEPT this one, in a new array
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  function clearCompleted() {
    setTasks((current) => current.filter((task) => !task.done));
  }

  // Worked out from the tasks on every render, never stored
  const doneCount = tasks.filter((task) => task.done).length;

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
          <TaskList tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
        </section>

        <TaskFooter total={tasks.length} doneCount={doneCount} onClearCompleted={clearCompleted} />
      </main>

      <p className="app__footer">Built with React and Vite</p>
    </div>
  );
}

export default App;
