import { FILTERS } from "../filters.js";
import "./FilterTabs.css";

// All 3 · Active 2 · Done 1
//
// Toggle buttons: aria-pressed tells screen readers which one is on
// ("Active, 2, toggle button, pressed"), so it isn't shown by colour alone.
//
// counts: { all, active, done }, worked out by the parent
function FilterTabs({ filter, counts, onChange }) {
  return (
    <div className="filters" role="group" aria-label="Show tasks">
      {FILTERS.map((option) => (
        <button
          key={option.value}
          type="button"
          className="filters__button"
          aria-pressed={filter === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
          <span className="filters__count">{counts[option.value]}</span>
        </button>
      ))}
    </div>
  );
}

export default FilterTabs;
