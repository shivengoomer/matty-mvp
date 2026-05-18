import React from "react";
import { cn } from "../../utils/cn";

function Skeleton({ className }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl bg-gradient-to-r from-[var(--surface-subtle)] via-[var(--surface-muted)] to-[var(--surface-subtle)] bg-[length:200%_100%]",
        className
      )}
    />
  );
}

export default React.memo(Skeleton);

