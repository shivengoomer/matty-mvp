import React, { useState } from "react";
import { Check } from "lucide-react";
import Card from "../../Components/ui/Card";
import Button from "../../Components/ui/Button";
import Badge from "../../Components/ui/Badge";
import { useToast } from "../../Components/feedback/ToastProvider";
import { useModal } from "../../Components/providers/ModalProvider";

const plans = [
  { id: "starter", name: "Starter", price: "$0", features: ["3 team members", "Basic templates", "Community support"] },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    features: ["Unlimited team members", "Advanced templates", "Priority support", "Version history"],
  },
  { id: "scale", name: "Scale", price: "$99", features: ["SSO", "Audit logs", "Dedicated success manager"] },
];

export default function BillingPage() {
  const { pushToast } = useToast();
  const { openModal } = useModal();
  const [active, setActive] = useState("pro");

  return (
    <div className="space-y-5">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)]">Billing & Subscription</h1>
            <p className="text-sm text-[var(--text-secondary)]">Stripe-ready plan architecture and invoice workflow.</p>
          </div>
          <Badge tone="success">Current: Pro</Badge>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={active === plan.id ? "border-[var(--accent)] ring-1 ring-[var(--accent)]" : ""}
          >
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">{plan.name}</h2>
            <p className="mt-1 text-3xl font-semibold text-[var(--text-primary)]">
              {plan.price}
              <span className="text-sm font-normal text-[var(--text-muted)]">/month</span>
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-500" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button
              className="mt-5 w-full"
              variant={active === plan.id ? "secondary" : "primary"}
              onClick={() => {
                setActive(plan.id);
                pushToast(`Plan changed to ${plan.name} (UI only)`, "info");
                openModal({
                  title: "Stripe-ready flow",
                  description: "Connect Stripe checkout/session creation on this action.",
                  content: (
                    <div className="space-y-3 text-sm text-[var(--text-secondary)]">
                      <p>Next integration step: call `/billing/create-checkout-session` and redirect.</p>
                      <div className="rounded-2xl bg-[var(--surface-subtle)] p-3">
                        Plan selected: <span className="font-medium text-[var(--text-primary)]">{plan.name}</span>
                      </div>
                    </div>
                  ),
                });
              }}
            >
              {active === plan.id ? "Current Plan" : "Select Plan"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
