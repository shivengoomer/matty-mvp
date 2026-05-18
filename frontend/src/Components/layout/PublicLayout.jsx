import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { useTheme } from "../providers/ThemeProvider";
import Button from "../ui/Button";

export default function PublicLayout() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[var(--app-bg)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3">
          <NavLink to="/" className="text-lg font-semibold text-[var(--text-primary)]">
            Matty
          </NavLink>
          <nav className="flex items-center gap-1">
            <NavLink to="/about" className="rounded-xl px-3 py-2 text-sm text-[var(--text-secondary)]">
              About
            </NavLink>
            <NavLink to="/signin" className="rounded-xl px-3 py-2 text-sm text-[var(--text-secondary)]">
              Sign in
            </NavLink>
            <Button size="sm" onClick={toggleTheme} variant="secondary">
              {theme === "dark" ? "Light" : "Dark"}
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:py-12">
        <Outlet />
      </main>
    </div>
  );
}

