import { NavLink } from "react-router-dom";
import { Code2, LayoutDashboard, Settings, Star } from "lucide-react";
import { Logo } from "./Logo";

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Snippets", to: "/snippets", icon: Code2 },
  { label: "Favorites", to: "/favorites", icon: Star },
  { label: "Settings", to: "/profile", icon: Settings },
];


function navClass({ isActive }) {
  return [
    "group flex items-center gap-4 rounded-lg px-4 py-3 text-base font-medium transition duration-200",
    isActive
      ? "border-l-2 border-periwinkle bg-periwinkle/10 text-periwinkle"
      : "text-slate-300 hover:bg-white/[0.06] hover:text-text",
  ].join(" ");
}

export function Sidebar() {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col border-r border-white/10 bg-panel/70 px-5 py-8 backdrop-blur-xl lg:flex">
        <div className="mb-16">
          <div className="mb-4 flex items-center gap-4">
            <Logo compact />
            <div>
              <h1 className="text-3xl font-extrabold leading-none text-text drop-shadow">
                Snit Console
              </h1>
              <p className="mt-2 text-sm text-slate-300">v1.0.4-stable</p>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.label} to={item.to} className={navClass}>
                <Icon size={25} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto">
          <button className="ghost-button w-full py-3">Upgrade Pro</button>
        </div>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-4 border-t border-white/10 bg-panel/95 p-2 backdrop-blur-xl lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                [
                  "flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold transition",
                  isActive ? "bg-periwinkle/10 text-periwinkle" : "text-muted",
                ].join(" ")
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
