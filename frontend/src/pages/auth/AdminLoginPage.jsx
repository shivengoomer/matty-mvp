import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAdmin, setUser } from "../../store/userSlice";
import AuthShell from "./AuthShell";
import Input from "../../Components/ui/Input";
import Button from "../../Components/ui/Button";
import { useToast } from "../../Components/feedback/ToastProvider";
import { saveAuthSession } from "../../utils/authStorage";
import { login } from "../../services/authService";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pushToast } = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // The backend login handles authentication. Since they are an admin, the backend should return role === 'admin'
      const payload = await login({ username, password });
      
        pushToast("User is not an admin", "error");
        return;
      }
      const user = {
        _id: payload._id,
        username: payload.username,
        role: payload.role,
        token: payload.token,
      };

      saveAuthSession({ token: payload.token, refreshToken: payload.refreshToken, user });
      dispatch(setUser(user));
      dispatch(setAdmin(true));
      pushToast("Admin login successful", "success");
      navigate("/admindashboard");
    } catch (error) {
      pushToast(error.response?.data?.message || "Invalid admin credentials", "error");
    }
  };

  return (
    <AuthShell
      title="Admin login"
      subtitle="Restricted access for platform operations"
      aside={
        <>
          <div className="rounded-2xl bg-[var(--surface-subtle)] p-4 text-sm text-[var(--text-secondary)]">
            User management
          </div>
          <div className="rounded-2xl bg-[var(--surface-subtle)] p-4 text-sm text-[var(--text-secondary)]">
            Template governance
          </div>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block space-y-2 text-sm text-[var(--text-secondary)]">
          Username
          <Input value={username} onChange={(event) => setUsername(event.target.value)} required />
        </label>
        <label className="block space-y-2 text-sm text-[var(--text-secondary)]">
          Password
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <Button type="submit" className="w-full">
          Continue
        </Button>
      </form>
    </AuthShell>
  );
}

