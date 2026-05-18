import React from "react";
import Card from "./Card";
import Button from "./Button";

function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <Card className="flex min-h-64 flex-col items-center justify-center gap-3 text-center">
      <div className="h-14 w-14 rounded-2xl bg-[var(--surface-subtle)]" />
      <h3 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
      <p className="max-w-md text-sm text-[var(--text-secondary)]">{description}</p>
      {actionLabel ? <Button onClick={onAction}>{actionLabel}</Button> : null}
    </Card>
  );
}

export default React.memo(EmptyState);

