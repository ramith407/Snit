import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell, Plus, SquareTerminal, UserRound, X, Check, Trash2,
  LayoutDashboard, Code2, Star, Settings, LogOut, FileCode2, Search,
  ChevronRight,
} from "lucide-react";
import { SearchBar } from "./SearchBar";
import { useAuth } from "../context/AuthContext";
import { useSnippets } from "../context/SnippetContext";
import { formatTimeAgo } from "../context/SnippetContext";
import avatarUrl from "../assets/avatar.svg";

// ─── Notifications Dropdown ───────────────────────────────────────────────────
function NotificationsDropdown({ onClose }) {
  const { notifications, markAllNotificationsAsRead, clearNotifications } = useSnippets();
  const ref = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-white/10 bg-panel/95 shadow-panel backdrop-blur-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <h3 className="font-semibold text-text">Notifications</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={markAllNotificationsAsRead}
            className="icon-button h-7 w-7 text-muted hover:text-periwinkle"
            title="Mark all as read"
          >
            <Check size={15} />
          </button>
          <button
            onClick={clearNotifications}
            className="icon-button h-7 w-7 text-muted hover:text-danger"
            title="Clear all"
          >
            <Trash2 size={15} />
          </button>
          <button onClick={onClose} className="icon-button h-7 w-7 text-muted hover:text-text">
            <X size={15} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-72 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted">
            <Bell className="mx-auto mb-2 opacity-30" size={28} />
            <p>All caught up!</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`flex gap-3 border-b border-white/5 px-4 py-3 text-sm transition last:border-0 ${
                n.read ? "opacity-50" : "bg-periwinkle/[0.04]"
              }`}
            >
              <span
                className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                  n.read ? "bg-transparent" : "bg-periwinkle"
                }`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-slate-200">{n.text}</p>
                <p className="mt-1 text-xs text-muted">{formatTimeAgo(n.time)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Command Palette ──────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { id: "dashboard", label: "Go to Dashboard", icon: LayoutDashboard, to: "/dashboard", group: "Navigate" },
  { id: "snippets",  label: "My Snippets",      icon: Code2,           to: "/snippets",  group: "Navigate" },
  { id: "favorites", label: "Favorites",         icon: Star,            to: "/favorites", group: "Navigate" },
  { id: "new",       label: "Create New Snippet",icon: Plus,            to: "/snippets/new", group: "Actions" },
  { id: "profile",   label: "Settings / Profile",icon: Settings,        to: "/profile",   group: "Navigate" },
];

function CommandPalette({ onClose }) {
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const { snippets, searchSnippets } = useSnippets();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Build combined list
  const snippetResults = query.trim()
    ? searchSnippets(query).slice(0, 4).map((s) => ({
        id: `snippet-${s.id}`,
        label: s.title,
        icon: FileCode2,
        to: `/snippets/${s.id}`,
        group: "Snippets",
        meta: s.language,
      }))
    : [];

  const logoutAction = {
    id: "logout", label: "Log Out", icon: LogOut, group: "Account", action: () => { logout(); navigate("/auth"); onClose(); },
  };

  const actions = query.trim()
    ? [
        ...QUICK_ACTIONS.filter((a) =>
          a.label.toLowerCase().includes(query.toLowerCase())
        ),
        ...snippetResults,
        ...(("log out".includes(query.toLowerCase())) ? [logoutAction] : []),
      ]
    : [...QUICK_ACTIONS, logoutAction];

  // Reset active when results change
  useEffect(() => setActiveIdx(0), [query]);

  const runAction = useCallback(
    (item) => {
      if (item.action) { item.action(); return; }
      navigate(item.to);
      onClose();
    },
    [navigate, onClose]
  );

  const handleKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % actions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i - 1 + actions.length) % actions.length);
    } else if (e.key === "Enter" && actions[activeIdx]) {
      runAction(actions[activeIdx]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  // Group actions
  const groups = actions.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-[999] flex items-start justify-center pt-[12vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-void/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-xl border border-white/10 bg-panel/95 shadow-panel backdrop-blur-xl">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
          <Search size={20} className="shrink-0 text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            className="flex-1 bg-transparent text-base text-text placeholder:text-muted outline-none"
            placeholder="Search snippets or type a command..."
          />
          <kbd className="hidden rounded border border-white/15 px-2 py-0.5 text-xs text-muted sm:inline">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[380px] overflow-y-auto py-2">
          {actions.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">No results found.</p>
          ) : (
            Object.entries(groups).map(([groupName, items]) => (
              <div key={groupName}>
                <p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted">
                  {groupName}
                </p>
                {items.map((item) => {
                  const globalIdx = actions.indexOf(item);
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onMouseEnter={() => setActiveIdx(globalIdx)}
                      onClick={() => runAction(item)}
                      className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition ${
                        activeIdx === globalIdx
                          ? "bg-periwinkle/15 text-periwinkle"
                          : "text-slate-300 hover:bg-white/[0.04]"
                      }`}
                    >
                      <Icon size={17} className="shrink-0" />
                      <span className="flex-1 truncate text-left">{item.label}</span>
                      {item.meta && (
                        <span className="rounded bg-white/10 px-2 py-0.5 mono text-xs text-muted">
                          {item.meta}
                        </span>
                      )}
                      {activeIdx === globalIdx && (
                        <ChevronRight size={15} className="shrink-0 opacity-60" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 border-t border-white/10 px-4 py-2 text-xs text-muted">
          <span><kbd className="rounded border border-white/15 px-1.5 py-0.5">↑↓</kbd> Navigate</span>
          <span><kbd className="rounded border border-white/15 px-1.5 py-0.5">Enter</kbd> Select</span>
          <span><kbd className="rounded border border-white/15 px-1.5 py-0.5">Esc</kbd> Close</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Topbar ──────────────────────────────────────────────────────────────
export function Topbar({ breadcrumb }) {
  const { user } = useAuth();
  const { notifications } = useSnippets();
  const [search, setSearch] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPalette, setShowPalette] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    function handler(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowPalette((v) => !v);
      }
      if (e.key === "Escape") {
        setShowPalette(false);
        setShowNotifications(false);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-white/10 bg-void/85 backdrop-blur-xl">
        <div className="flex h-20 items-center gap-4 px-4 sm:px-6 lg:px-10">
          {/* Desktop search / breadcrumb */}
          <div className="hidden min-w-0 flex-1 items-center gap-3 text-sm text-slate-200 md:flex">
            {breadcrumb ? (
              breadcrumb
            ) : (
              <SearchBar
                className="w-full max-w-xl"
                value={search}
                onChange={setSearch}
                onResultClick={() => setSearch("")}
              />
            )}
          </div>

          {/* Mobile search */}
          <SearchBar
            className="flex-1 md:hidden"
            placeholder="Search..."
            value={search}
            onChange={setSearch}
            onResultClick={() => setSearch("")}
          />

          {/* Right controls */}
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {/* Bell */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications((v) => !v); setShowPalette(false); }}
                className="icon-button relative"
                aria-label="Notifications"
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-periwinkle text-[10px] font-bold text-void">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && (
                <NotificationsDropdown onClose={() => setShowNotifications(false)} />
              )}
            </div>

            {/* Command Palette trigger */}
            <button
              onClick={() => { setShowPalette((v) => !v); setShowNotifications(false); }}
              className="icon-button"
              aria-label="Command palette (Ctrl+K)"
              title="Command palette  Ctrl+K"
            >
              <SquareTerminal size={22} />
            </button>

            {/* Create Snippet */}
            <Link
              to="/snippets/new"
              className="gradient-button hidden h-11 px-4 text-sm sm:inline-flex"
            >
              <Plus size={18} />
              Create Snippet
            </Link>

            {/* Avatar (desktop) */}
            <Link to="/profile" className="hidden sm:block" aria-label="User profile">
              <img
                src={user?.avatarUrl || avatarUrl}
                alt={user?.name || "User"}
                className="h-10 w-10 rounded-full border border-white/15 bg-panel object-cover transition hover:border-periwinkle/50"
              />
            </Link>

            {/* Avatar icon (mobile) */}
            <Link to="/profile" className="icon-button sm:hidden" aria-label="User profile">
              <UserRound size={21} />
            </Link>
          </div>
        </div>
      </header>

      {/* Command Palette overlay */}
      {showPalette && <CommandPalette onClose={() => setShowPalette(false)} />}
    </>
  );
}
