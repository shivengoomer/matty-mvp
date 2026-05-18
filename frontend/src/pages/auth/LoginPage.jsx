import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { setAdmin, setUser } from "../../store/userSlice";
import { saveAuthSession } from "../../utils/authStorage";
import { login } from "../../services/authService";
import { useToast } from "../../Components/feedback/ToastProvider";
import Input from "../../Components/ui/Input";
import Button from "../../Components/ui/Button";
import AuthShell from "./AuthShell";
import GLogin from "../../Login/GLogin";

const CLIENT_ID =
  "551070839040-qh22gqelveth5aaiqfan1fm43v0tvs7s.apps.googleusercontent.com";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pushToast } = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const payload = await login({ username, password });
      const user = {
        _id: payload._id,
        username: payload.username,
        role: payload.role,
        token: payload.token,
      };
      saveAuthSession({ token: payload.token, refreshToken: payload.refreshToken, user });
      dispatch(setUser(user));
      dispatch(setAdmin(payload.role === "admin"));
      pushToast(`Welcome back, ${payload.username}`, "success");
      navigate("/dashboard");
    } catch (error) {
      pushToast(error.response?.data?.message || "Sign in failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Sign in"
      subtitle="Continue to your workspace"
      aside={
        <>
          <div className="rounded-2xl bg-[var(--surface-subtle)] p-4 text-sm text-[var(--text-secondary)]">
            Template management
          </div>
          <div className="rounded-2xl bg-[var(--surface-subtle)] p-4 text-sm text-[var(--text-secondary)]">
            Team dashboards
          </div>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-2 text-sm text-[var(--text-secondary)]">
          Username
          <Input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            autoComplete="username"
            placeholder="Enter your username"
          />
        </label>
        <label className="block space-y-2 text-sm text-[var(--text-secondary)]">
          Password
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
            placeholder="Enter your password"
          />
        </label>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <div className="mt-4 flex justify-center">
        <GoogleOAuthProvider clientId={CLIENT_ID}>
          <GLogin />
        </GoogleOAuthProvider>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
        <Link to="/forgot-password" className="text-[var(--accent)]">
          Forgot password?
        </Link>
        <Link to="/register" className="text-[var(--text-secondary)]">
          Create account
        </Link>
      </div>
    </AuthShell>
  );
}
