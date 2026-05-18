import React from "react";
import Card from "../../Components/ui/Card";

export default function AuthShell({ title, subtitle, children, aside }) {
  return (
    <div className="grid min-h-[calc(100vh-10rem)] items-center gap-6 lg:grid-cols-[1.1fr,0.9fr]">
      <section className="hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow-soft)] lg:block">
        <h2 className="text-4xl font-semibold tracking-tight text-[var(--text-primary)]">Matty Studio</h2>
        <p className="mt-3 max-w-md text-sm text-[var(--text-secondary)]">
          Premium creative operations for startups and enterprise teams. Fast editing, reusable templates, and smooth
          workflows.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-3">{aside}</div>
      </section>
      <Card className="mx-auto w-full max-w-md p-6 md:p-8">
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]">{title}</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </Card>
    </div>
  );
}

