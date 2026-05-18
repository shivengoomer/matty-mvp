import React, { Suspense, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { PanelRight, X } from "lucide-react";
import { appNav } from "../../app/navigation";
import { useAuthUser } from "../../hooks/useAuthUser";
import AppSidebar from "./AppSidebar";
import AppTopbar from "./AppTopbar";
import CommandPalette from "../system/CommandPalette";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import Skeleton from "../ui/Skeleton";

function ShellFallback() {
  return (
    <div className="space-y-4 p-4 md:p-6">
      <Skeleton className="h-20 w-full" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );
}

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const { isAdmin } = useAuthUser();
  const location = useLocation();

  const mobileItems = useMemo(() => {
    const role = isAdmin ? "admin" : "user";
    return appNav.filter((item) => item.roles.includes(role));
  }, [isAdmin]);

  useKeyboardShortcuts([
    {
      key: "k",
      ctrlKey: true,
      metaKey: false,
      shiftKey: false,
      callback: () => setPaletteOpen((prev) => !prev),
    },
    {
      key: "k",
      ctrlKey: false,
      metaKey: true,
      shiftKey: false,
      callback: () => setPaletteOpen((prev) => !prev),
    },
  ]);

  return (
    <div className="min-h-screen bg-[var(--app-bg)]">
      <div className="lg:hidden">
        <button
          className="fixed left-4 top-4 z-50 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          <PanelRight size={18} />
        </button>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)}>
          <aside
            onClick={(event) => event.stopPropagation()}
            className="h-full w-72 border-r border-[var(--border)] bg-[var(--surface)] p-4"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-[var(--text-primary)]">Navigation</h2>
              <button
                className="rounded-xl p-1 text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]"
                onClick={() => setMobileOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <nav className="space-y-1">
              {mobileItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "block rounded-2xl bg-[var(--surface-muted)] px-3 py-2 text-sm text-[var(--text-primary)]"
                      : "block rounded-2xl px-3 py-2 text-sm text-[var(--text-secondary)]"
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      ) : null}

      <div className="flex">
        <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((prev) => !prev)} />
        <main className="min-h-screen flex-1">
          <AppTopbar onOpenCommandPalette={() => setPaletteOpen(true)} />
          <div key={location.pathname} className="animate-page-enter p-4 md:p-6">
            <Suspense fallback={<ShellFallback />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}

