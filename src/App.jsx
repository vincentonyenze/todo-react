// The whole app. For now just its layout: the add form, the filters and
// the list arrive over the next steps.

// "Tuesday, October 20": today's date, worked out once when the page loads
const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <p className="app__date">{today}</p>
        <h1 className="app__title">My tasks</h1>
      </header>

      <main className="todo-card">
        {/* Step 3: the form to add a task */}
        <section className="todo-card__section" aria-label="Add a task">
          <p>(The add form comes in Step 3.)</p>
        </section>

        {/* Steps 3–8: the list of tasks */}
        <section className="todo-card__section" aria-label="Tasks">
          <div className="empty">
            <span className="empty__icon" aria-hidden="true">
              🎉
            </span>
            <p>Nothing to do yet. Add your first task above.</p>
          </div>
        </section>

        <footer className="todo-card__section todo-card__footer">
          <p>0 tasks</p>
        </footer>
      </main>

      <p className="app__footer">Built with React and Vite</p>
    </div>
  );
}

export default App;
