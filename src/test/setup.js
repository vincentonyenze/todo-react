// Runs before every test file (see "setupFiles" in vite.config.js)

import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// jest-dom adds matchers like toBeInTheDocument(), toHaveFocus(), toBeChecked()

afterEach(() => {
  // Remove whatever the test rendered, so the next test starts on an empty page
  cleanup();
  // The app saves to localStorage: without this, tasks from one test would
  // load into the next
  localStorage.clear();
});
