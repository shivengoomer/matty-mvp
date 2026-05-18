import React from "react";
import { cn } from "../../utils/cn";

function Card({ className, children, ...props }) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-soft)] backdrop-blur-xl",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export default React.memo(Card);

