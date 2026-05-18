import { Search } from "lucide-react";

export function SearchBar({
  placeholder = "Search snippets, tags, or commands...",
  className = "",
}) {
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
      />
    </label>
  );
}
