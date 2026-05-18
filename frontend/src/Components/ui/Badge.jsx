import React from "react";
import { cn } from "../../utils/cn";

const tones = {
  neutral: "bg-[var(--surface-subtle)] text-[var(--text-secondary)]",
  success: "bg-emerald-500/15 text-emerald-500",
  warning: "bg-amber-500/15 text-amber-500",
  danger: "bg-rose-500/15 text-rose-500",
};

function Badge({ className, tone = "neutral", children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export default React.memo(Badge);

