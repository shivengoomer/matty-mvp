import React from "react";
import { LogOut, MoonStar, Search, Sun, UserCircle2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout as clearReduxUser, setAdmin } from "../../store/userSlice";
import { useTheme } from "../providers/ThemeProvider";
import Button from "../ui/Button";
import { useAuthUser } from "../../hooks/useAuthUser";
import { useToast } from "../feedback/ToastProvider";
import { clearAuthSession } from "../../utils/authStorage";
import { logout as logoutRequest } from "../../services/authService";

function AppTopbar({ onOpenCommandPalette }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuthUser();
  const { pushToast } = useToast();

  const handleLogout = async () => {
    const refreshToken = sessionStorage.getItem("refreshToken");
    try {
      await logoutRequest(refreshToken);
    } catch {
      // keep local logout resilient
    }

    clearAuthSession();
    dispatch(clearReduxUser());
    dispatch(setAdmin(false));
    pushToast("Logged out", "success");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface)]/85 px-4 py-3 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="h-9" onClick={onOpenCommandPalette}>
            <Search size={16} />
            <span className="ml-2 hidden sm:block">Command</span>
            <span className="ml-2 rounded bg-[var(--surface-muted)] px-2 py-0.5 text-[10px]">Ctrl K</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={16} /> : <MoonStar size={16} />}
          </Button>
          <Link
            to="/settings"
            className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          >
            <UserCircle2 size={16} />
            <span className="max-w-28 truncate">{user?.username || "Account"}</span>
          </Link>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut size={16} />
          </Button>
        </div>
      </div>
    </header>
  );
}

export default React.memo(AppTopbar);

