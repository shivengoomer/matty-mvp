import React from "react";
import { cn } from "../../utils/cn";

const Input = React.forwardRef(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-11 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-subtle)] px-4 text-sm text-[var(--text-primary)]",
        "placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]",
        className
      )}
      {...props}
    />
  );
});

export default React.memo(Input);

