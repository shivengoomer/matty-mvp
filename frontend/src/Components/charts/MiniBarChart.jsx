import React, { useMemo } from "react";

function MiniBarChart({ values = [] }) {
  const normalized = useMemo(() => {
    const max = Math.max(...values, 1);
    return values.map((value, index) => ({
      id: index,
      height: Math.max((value / max) * 100, 8),
    }));
  }, [values]);

  return (
    <div className="flex h-32 items-end gap-2">
      {normalized.map((bar) => (
        <div
          key={bar.id}
          className="w-full rounded-t-2xl bg-gradient-to-t from-[var(--accent)] to-[var(--accent-soft)] transition-all"
          style={{ height: `${bar.height}%` }}
        />
      ))}
    </div>
  );
}

export default React.memo(MiniBarChart);

