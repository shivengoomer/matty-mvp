// Header/Navbar.jsx
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUser, setAdmin } from "../store/userSlice";
import mattyLogo from "../assets/mattyLogo.png";
import { useTheme } from "../Components/ThemeProvider";
import axiosInstance from "../utils/axiosinstance";
import { clearAuthSession } from "../utils/authStorage";
import { useToast } from "../Components/ToastProvider";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const { pushToast } = useToast();
  const authStatus = useSelector((state) => state.user.user);
  const isAdmin = useSelector((state) => state.user.isAdmin);

  const handleLogout = async () => {
    const refreshToken = sessionStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        await axiosInstance.post("/api/auth/logout", { refreshToken });
      } catch {}
    }

    clearAuthSession();
    dispatch(setUser(null));
    dispatch(setAdmin(false));
    pushToast("You have been logged out", "success");
    navigate("/");
  };

  const navItems = [
    { name: "Editor", route: "/editor", active: !!authStatus },
    { name: "Templates", route: "/templates", active: true },
    {
      name: "Dashboard",
      route: "/dashboard",
      active: !!authStatus && !isAdmin,
    },
    { name: "Admin Dashboard", route: "/admindashboard", active: isAdmin },
    { name: "Users", route: "/users", active: isAdmin },
    { name: "Add Template", route: "/addtemp", active: isAdmin },
    { name: "Login", route: "/signin", active: !authStatus && !isAdmin },
    { name: "AdminLogin", route: "/admin", active: !authStatus && !isAdmin },
    { name: "Signup", route: "/register", active: !authStatus && !isAdmin },
    { name: "About", route: "/about", active: true },
  ];

  return (
    <nav className="surface sticky top-0 z-40 flex h-[64px] w-full justify-between border-b px-3 py-2 backdrop-blur">
      <div className="flex h-[60px] py-2">
        <img
          src={mattyLogo}
          alt="Matty Logo"
          className="mr-2 h-[40px] md:h-[50px] w-auto"
        />
        <Link
          to="/"
          className="py-1 text-xl font-bold text-[var(--accent)] md:text-3xl"
        >
          Matty
        </Link>
      </div>
      <div className="flex h-[60px] items-center gap-2 py-2">
        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-md border border-[var(--border)] px-2 py-1 text-xs text-[var(--text)]"
        >
          {theme === "dark" ? "Light" : "Dark"}
        </button>
        <div className="flex">
          {navItems.map((item) =>
            item.active ? (
              <NavLink
                key={item.name}
                to={item.route}
                className={({ isActive }) =>
                  `${
                    isActive ? "font-medium text-[var(--accent)] underline" : ""
                  } inline-block w-auto rounded-full px-1 py-2 text-sm text-[var(--text)] duration-200 hover:text-[var(--accent)] hover:underline md:px-2 md:text-lg`
                }
              >
                {item.name}
              </NavLink>
            ) : null
          )}
          {(authStatus || isAdmin) && (
            <button
              className="m-1 inline-block rounded-md bg-[var(--accent)] px-2 py-1 text-center text-white"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
