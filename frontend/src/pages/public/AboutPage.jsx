import React from "react";
import Card from "../../Components/ui/Card";

export default function AboutPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="md:col-span-2">
        <h1 className="text-3xl font-semibold text-[var(--text-primary)]">About Matty</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)]">
          Matty is a modern design workspace built for teams that need production-quality creative output with less
          tool sprawl. The platform combines template management, editing, and workflow controls in one interface.
        </p>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Mission</h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Give growth teams a focused environment to ship visual campaigns quickly while preserving brand quality.
        </p>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Stack</h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          React, Redux Toolkit, Tailwind CSS, role-aware routing, service-layer API integration, and hardened session
          handling.
        </p>
      </Card>
    </div>
  );
}

