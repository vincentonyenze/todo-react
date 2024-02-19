// The starting point: index.html loads this file, and React takes over
// the empty <div id="root"> to draw <App /> inside it.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  // StrictMode adds extra checks while developing (it runs some code twice
  // on purpose, to catch mistakes). It does nothing in the real build.
  <StrictMode>
    <App />
  </StrictMode>
);
