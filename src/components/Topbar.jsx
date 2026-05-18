import { Link } from "react-router-dom";
import { Bell, Plus, SquareTerminal, UserRound } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { currentUser } from "../data/snippets";

export function Topbar({ breadcrumb }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-void/85 backdrop-blur-xl">
      <div className="flex h-20 items-center gap-4 px-4 sm:px-6 lg:px-10">
        <div className="hidden min-w-0 flex-1 items-center gap-3 text-sm text-slate-200 md:flex">
          {breadcrumb ? (
            breadcrumb
          ) : (
            <SearchBar className="w-full max-w-xl" />
          )}
        </div>
        <SearchBar className="flex-1 md:hidden" placeholder="Search..." />
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <button className="icon-button" aria-label="Notifications">
            <Bell size={22} />
          </button>
          <button className="icon-button" aria-label="Command palette">
            <SquareTerminal size={22} />
          </button>
          <Link to="/snippets/new" className="gradient-button hidden h-11 px-4 text-sm sm:inline-flex">
            <Plus size={18} />
            Create Snippet
          </Link>
          <Link to="/profile" className="hidden sm:block" aria-label="User profile">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="h-10 w-10 rounded-full border border-white/15 bg-panel object-cover"
            />
          </Link>
          <Link to="/profile" className="icon-button sm:hidden" aria-label="User profile">
            <UserRound size={21} />
          </Link>
        </div>
      </div>
    </header>
  );
}
