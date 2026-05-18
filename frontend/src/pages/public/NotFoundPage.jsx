import React from "react";
import { Link } from "react-router-dom";
import Card from "../../Components/ui/Card";
import Button from "../../Components/ui/Button";

export default function NotFoundPage() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <Card className="max-w-md text-center">
        <h1 className="text-4xl font-semibold text-[var(--text-primary)]">404</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">The page you requested does not exist.</p>
        <Link to="/" className="mt-4 inline-block">
          <Button variant="secondary">Back to home</Button>
        </Link>
      </Card>
    </div>
  );
}

