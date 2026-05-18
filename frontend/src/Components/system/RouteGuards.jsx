import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthUser } from "../../hooks/useAuthUser";

export function RequireAuth({ children }) {
  const { isAuthenticated } = useAuthUser();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}

export function RequireAdmin({ children }) {
  const { isAuthenticated, isAdmin } = useAuthUser();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

