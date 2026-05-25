import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useSnippets } from "../context/SnippetContext";

export function SearchBar({
  value: controlledValue,
  onChange,
  onResultClick,
  placeholder = "Search snippets, tags, or commands...",
  className = "",
}) {
  const [internalValue, setInternalValue] = useState("");
  const [focused, setFocused] = useState(false);
  const blurTimeout = useRef(null);
  const { searchSnippets } = useSnippets();

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const setValue = onChange || setInternalValue;

  const results = value.trim() ? searchSnippets(value).slice(0, 5) : [];
  const showDropdown = focused && results.length > 0;

  const handleBlur = () => {
    blurTimeout.current = setTimeout(() => setFocused(false), 150);
  };

  const handleFocus = () => {
    clearTimeout(blurTimeout.current);
    setFocused(true);
  };

  const handleResultClick = () => {
    onResultClick?.();
    setFocused(false);
  };

  return (
    <label className={`relative block ${className}`}>
      <Search
        size={21}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
      />
      <input
        className="input-shell h-12 pl-12 mono text-sm"
        placeholder={placeholder}
        aria-label={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-white/10 bg-panel/95 shadow-panel backdrop-blur-xl">
          {results.map((snippet) => (
            <Link
              key={snippet.id}
              to={`/snippets/${snippet.id}`}
              onClick={handleResultClick}
              className="flex items-center justify-between gap-3 px-4 py-3 text-sm transition hover:bg-white/[0.06]"
            >
              <span className="truncate font-medium text-text">
                {snippet.title}
              </span>
              <span className="shrink-0 rounded bg-white/10 px-2 py-0.5 mono text-xs text-muted">
                {snippet.language}
              </span>
            </Link>
          ))}
        </div>
      )}
    </label>
  );
}
