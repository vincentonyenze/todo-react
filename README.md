# To-Do

A to-do list built with **React** and **Vite**. You can add tasks with a priority, tick them off, edit them in place, filter and sort them, and clear finished ones. Everything is saved in your browser, so your list is still there after a refresh. It works fully from the keyboard, in light and dark mode, and is covered by **39 automated tests**.

This is **Project 15** in my beginner-to-expert web development roadmap, and my first React app built with **Vite** (my first React project, P14, used Create React App).

<!-- Add a screenshot: save one as screenshot.png in this folder and uncomment the line below -->
<!-- ![To-do app screenshot](screenshot.png) -->

## Features

- **Add tasks** with a priority (High, Medium or Low). Blank tasks are refused with a clear message.
- **Tick tasks off**. Finished ones are crossed out but still readable.
- **Edit in place**: change a title or priority. **Enter** saves, **Escape** cancels.
- **Delete** a single task, or **clear all completed** ones after a quick "are you sure?"
- **Filter**: All, Active or Done, each with a live count.
- **Sort**: newest first, oldest first, by priority, or A to Z.
- **Saved automatically** to `localStorage`, along with your sort choice.
- **Survives bad data**: broken or outdated saved data is repaired or skipped, never crashes the app.

## Accessibility built in

- **Focus always lands somewhere sensible.** When you start editing, the text box is focused with its text selected. After saving or cancelling, focus goes back to the ✏️ button. When the row you were on disappears (deleted, or ticked in the Active view), focus moves to the next task. If none are left, it moves to the new-task box.
- Every input has a label. A task's title **is** its checkbox's label, so clicking the title ticks it.
- Icon buttons say which task they're for: "Edit "Buy milk"", "Delete "Buy milk"".
- Errors are announced (`role="alert"`) and mark the box as invalid (`aria-invalid`).
- The done count is announced as it changes (`aria-live`).
- The filter buttons use `aria-pressed`, and the CSS styles that same attribute, so the look and what a screen reader hears always match.
- **Priority is never shown by colour alone**: each badge says "High", "Medium" or "Low".
- Respects **reduced motion** and the system's **light or dark** setting.

## What I learned

- **Vite**: a fast dev server, `index.html` at the project root, `.jsx` files, and `npm run build` into `dist/`
- **Controlled inputs**: text boxes and dropdowns whose value lives in React state
- **Immutable updates**: new arrays with `map`, `filter` and spread, never `push` or changing objects in place
- **Lifting state up**: App owns the tasks, and the components below get data and functions through props
- **Derived state**: the counts and the visible list are calculated on every render, never stored twice
- **`useRef`**: reaching real elements (to focus them), and remembering values without redrawing
- **`useEffect`**: syncing with things outside React (focus, `localStorage`), and its dependency array
- **Callback refs** (React 19), which keep one ref per task in a `Map`, with cleanup
- **Focus management** when the element you're on disappears
- **`toSorted()`** and compare functions, and why sorting state in place is a bug
- **`useReducer`**: every task change described as an action (`"added"`, `"toggled"`...) and handled in one pure function
- **Lazy initial state**: `useState(loadSort)` instead of `useState(loadSort())`
- **Treating saved data as untrusted**: validate, repair what you can, drop what you can't
- **Testing with Vitest** and React Testing Library: unit tests for pure logic, user-style tests for the app, `user-event` 14's async API, `vi.spyOn`, and breaking the app on purpose to prove a test can fail

## How to run

You need [Node.js](https://nodejs.org/) 22.22 or newer (24 LTS recommended). The app itself runs on 20.19+, but the test tools need 22.22+.

```bash
git clone https://github.com/vincentonyenze/todo-react.git
cd todo-react
npm install
npm run dev
```

Open the address it prints (usually **http://localhost:5173**). The page updates instantly when you save a file.

| Command | Does |
|---|---|
| `npm run dev` | runs the app while you work on it |
| `npm test` | runs the tests, and re-runs them as you save (press `q` to quit) |
| `npm run test:run` | runs the tests once |
| `npm run lint` | checks the code with ESLint |
| `npm run build` | makes the finished, optimised app in `dist/` |
| `npm run preview` | serves the `dist/` build locally, to check it before publishing |

## Project structure

```
src/
├── main.jsx               # Starts React and draws <App /> into #root
├── index.css              # Design tokens (light + dark), reset, layout, shared styles
├── App.jsx                # Owns the state: tasks (reducer), filter, sort. Saves to localStorage
├── App.test.jsx           # Tests that use the app like a person would
├── tasksReducer.js        # Every way the tasks can change, in one pure function
├── priorities.js          # Priority levels, sort options, sortTasks()
├── filters.js             # All / Active / Done, counts, empty messages
├── storage.js             # Loading (with checks) and saving to localStorage
├── *.test.js              # Unit tests for the files above
├── test/setup.js          # Runs before each test file
└── components/
    ├── AddTaskForm.jsx    # New task: title, priority, Add
    ├── FilterTabs.jsx     # All / Active / Done buttons with counts
    ├── TaskList.jsx       # The list, the empty message, focus after a row disappears
    ├── TaskItem.jsx       # One task: checkbox, title, priority, edit and delete
    └── TaskFooter.jsx     # "2 of 5 done" and Clear completed
```

The logic lives in plain JavaScript files with no React in them (`tasksReducer`, `priorities`, `filters`, `storage`). That makes it quick to test, and easy to reuse.

## Known limitations

- Tasks are saved in **this browser only**. They don't sync between devices, or between two open tabs.
- No undo after deleting a task.
- No due dates, and no way to drag tasks into your own order.
