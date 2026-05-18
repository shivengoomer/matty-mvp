import { useMemo } from "react";
import { useSelector } from "react-redux";

export function useAuthUser() {
  const reduxUser = useSelector((state) => state.user?.user);
  const isAdminFlag = useSelector((state) => state.user?.isAdmin);

  return useMemo(() => {
    if (reduxUser?._id) {
      return {
        user: reduxUser,
        isAuthenticated: true,
        isAdmin: reduxUser.role === "admin" || isAdminFlag,
      };
    }

    try {
      const stored = JSON.parse(sessionStorage.getItem("user") || "{}");
      return {
        user: stored?._id ? stored : null,
        isAuthenticated: Boolean(stored?._id),
        isAdmin: stored?.role === "admin" || isAdminFlag,
      };
    } catch {
      return { user: null, isAuthenticated: false, isAdmin: false };
    }
  }, [reduxUser, isAdminFlag]);
}

