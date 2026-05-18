import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { appNav } from "../../app/navigation";
import { useAuthUser } from "../../hooks/useAuthUser";
import Input from "../ui/Input";

function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { isAdmin } = useAuthUser();

  const items = useMemo(() => {
    const role = isAdmin ? "admin" : "user";
    const accessible = appNav.filter((item) => item.roles.includes(role));
    if (!query.trim()) return accessible;
    return accessible.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
  }, [isAdmin, query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="mx-auto mt-[12vh] w-full max-w-2xl rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-hard)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
      >
        <div className="mb-3 flex items-center gap-2">
          <Search className="text-[var(--text-muted)]" size={18} />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pages..."
            aria-label="Search commands"
            autoFocus
          />
        </div>
        <div className="space-y-1">
          {items.map((item) => (
            <button
              key={item.path}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm text-[var(--text-secondary)] transition hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)]"
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
          {items.length === 0 ? (
            <p className="px-3 py-2 text-sm text-[var(--text-muted)]">No matches</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default React.memo(CommandPalette);

