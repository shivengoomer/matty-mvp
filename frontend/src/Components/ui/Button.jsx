import React from "react";
import { cn } from "../../utils/cn";

const variants = {
  primary:
    "bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)] focus-visible:ring-[var(--accent)]",
  secondary:
    "bg-[var(--surface-subtle)] text-[var(--text-primary)] hover:bg-[var(--surface-muted)] focus-visible:ring-[var(--text-primary)]",
  ghost:
    "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)] hover:text-[var(--text-primary)] focus-visible:ring-[var(--accent)]",
  danger:
    "bg-[var(--danger)] text-white hover:bg-[var(--danger-strong)] focus-visible:ring-[var(--danger)]",
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

const Button = React.forwardRef(function Button(
  { className, variant = "primary", size = "md", type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});

export default React.memo(Button);

