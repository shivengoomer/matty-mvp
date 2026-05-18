import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthShell from "./AuthShell";
import Input from "../../Components/ui/Input";
import Button from "../../Components/ui/Button";
import { requestPasswordReset } from "../../services/authService";
import { useToast } from "../../Components/feedback/ToastProvider";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { pushToast } = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset(email);
      pushToast("Password reset email sent", "success");
    } catch (error) {
      pushToast(error.response?.data?.message || "Could not process request", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Reset password"
      subtitle="We will send a reset link to your email"
      aside={
        <>
          <div className="rounded-2xl bg-[var(--surface-subtle)] p-4 text-sm text-[var(--text-secondary)]">
            Secure account recovery
          </div>
          <div className="rounded-2xl bg-[var(--surface-subtle)] p-4 text-sm text-[var(--text-secondary)]">
            Password policy checks
          </div>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-2 text-sm text-[var(--text-secondary)]">
          Email
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            placeholder="you@company.com"
          />
        </label>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending..." : "Send reset link"}
        </Button>
      </form>
      <p className="mt-4 text-sm text-[var(--text-secondary)]">
        Back to <Link className="text-[var(--accent)]" to="/signin">Sign in</Link>
      </p>
    </AuthShell>
  );
}

