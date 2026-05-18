import React from "react";
import { NavLink } from "react-router-dom";
import { PanelLeftClose, PanelRightClose } from "lucide-react";
import { appNav } from "../../app/navigation";
import { useAuthUser } from "../../hooks/useAuthUser";
import { cn } from "../../utils/cn";

function AppSidebar({ collapsed, onToggle }) {
  const { isAdmin } = useAuthUser();
  const role = isAdmin ? "admin" : "user";

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 border-r border-[var(--border)] bg-[var(--surface)]/85 p-3 backdrop-blur-xl lg:block",
        collapsed ? "w-20" : "w-72"
      )}
      aria-label="Sidebar navigation"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className={cn("overflow-hidden transition", collapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
          <p className="text-sm font-medium text-[var(--text-muted)]">Matty Studio</p>
          <h1 className="text-lg font-semibold text-[var(--text-primary)]">Workspace</h1>
        </div>
        <button
          className="rounded-xl bg-[var(--surface-subtle)] p-2 text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelRightClose size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <nav className="space-y-1">
        {appNav
          .filter((item) => item.roles.includes(role))
          .map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm transition",
                  isActive
                    ? "bg-[var(--surface-muted)] text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)]"
                )
              }
            >
              <item.icon size={18} />
              <span className={cn("transition", collapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
                {item.label}
              </span>
            </NavLink>
          ))}
      </nav>
    </aside>
  );
}

export default React.memo(AppSidebar);

