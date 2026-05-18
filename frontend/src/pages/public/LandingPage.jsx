import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck, Layers3 } from "lucide-react";
import Card from "../../Components/ui/Card";
import Button from "../../Components/ui/Button";

export default function LandingPage() {
  return (
    <div className="space-y-8 md:space-y-12">
        <section className="relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-hard)] md:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(119,140,255,0.18),transparent_46%),radial-gradient(circle_at_bottom_left,rgba(82,173,167,0.18),transparent_40%)]" />
          <div className="relative z-10 max-w-3xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--surface-subtle)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]">
              <Sparkles size={14} />
              SaaS-grade creative workspace
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-[var(--text-primary)] md:text-6xl">
              Build campaigns faster with a premium design studio
            </h1>
            <p className="mt-4 max-w-2xl text-base text-[var(--text-secondary)] md:text-lg">
              Matty gives teams a focused workspace for templates, brand-safe editing, and lightweight collaboration.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register">
                <Button size="lg">
                  Start free
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              <Link to="/signin">
                <Button size="lg" variant="secondary">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <Layers3 className="text-[var(--accent)]" />
            <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">Reusable templates</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Build and distribute brand-ready design templates across teams.
            </p>
          </Card>
          <Card>
            <ShieldCheck className="text-[var(--accent)]" />
            <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">Role-aware access</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Admin and member workflows are clearly separated without extra complexity.
            </p>
          </Card>
          <Card>
            <Sparkles className="text-[var(--accent)]" />
            <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">Fast UX</h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Keyboard-first interactions, command palette, and responsive interface by default.
            </p>
          </Card>
        </section>
    </div>
  );
}

