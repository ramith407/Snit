import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-void text-text">
      <Sidebar />
      <div className="min-h-screen lg:pl-[260px]">
        <Topbar />
        <main className="px-4 py-8 pb-28 sm:px-6 lg:px-10 lg:pb-10">
          <div className="mx-auto w-full max-w-[1220px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
