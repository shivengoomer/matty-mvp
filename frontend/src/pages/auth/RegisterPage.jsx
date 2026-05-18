import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAdmin, setUser } from "../../store/userSlice";
import { register } from "../../services/authService";
import { saveAuthSession } from "../../utils/authStorage";
import { useToast } from "../../Components/feedback/ToastProvider";
import Input from "../../Components/ui/Input";
import Button from "../../Components/ui/Button";
import AuthShell from "./AuthShell";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pushToast } = useToast();

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      pushToast("Passwords do not match", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = await register({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      const user = {
        _id: payload._id,
        username: payload.username,
        role: payload.role,
        token: payload.token,
      };
      saveAuthSession({ token: payload.token, refreshToken: payload.refreshToken, user });
      dispatch(setUser(user));
      dispatch(setAdmin(payload.role === "admin"));
      pushToast("Account created successfully", "success");
      navigate("/dashboard");
    } catch (error) {
      pushToast(error.response?.data?.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create account"
      subtitle="Launch your creative workspace"
      aside={
        <>
          <div className="rounded-2xl bg-[var(--surface-subtle)] p-4 text-sm text-[var(--text-secondary)]">
            Free starter workspace
          </div>
          <div className="rounded-2xl bg-[var(--surface-subtle)] p-4 text-sm text-[var(--text-secondary)]">
            Upgrade any time
          </div>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-2 text-sm text-[var(--text-secondary)]">
          Username
          <Input value={form.username} onChange={(event) => setField("username", event.target.value)} required />
        </label>
        <label className="block space-y-2 text-sm text-[var(--text-secondary)]">
          Email
          <Input
            type="email"
            value={form.email}
            onChange={(event) => setField("email", event.target.value)}
            required
          />
        </label>
        <label className="block space-y-2 text-sm text-[var(--text-secondary)]">
          Password
          <Input
            type="password"
            value={form.password}
            onChange={(event) => setField("password", event.target.value)}
            required
          />
        </label>
        <label className="block space-y-2 text-sm text-[var(--text-secondary)]">
          Confirm Password
          <Input
            type="password"
            value={form.confirmPassword}
            onChange={(event) => setField("confirmPassword", event.target.value)}
            required
          />
        </label>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>
      <p className="mt-4 text-sm text-[var(--text-secondary)]">
        Already have an account? <Link to="/signin" className="text-[var(--accent)]">Sign in</Link>
      </p>
    </AuthShell>
  );
}
