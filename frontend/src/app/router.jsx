import React, { lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import PublicLayout from "../Components/layout/PublicLayout";
import AppShell from "../Components/layout/AppShell";
import { RequireAdmin, RequireAuth } from "../Components/system/RouteGuards";

const LandingPage = lazy(() => import("../pages/public/LandingPage"));
const AboutPage = lazy(() => import("../pages/public/AboutPage"));
const NotFoundPage = lazy(() => import("../pages/public/NotFoundPage"));

const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("../pages/auth/ForgotPasswordPage"));
const AdminLoginPage = lazy(() => import("../pages/auth/AdminLoginPage"));

const DashboardPage = lazy(() => import("../pages/app/DashboardPage"));
const TemplatesPage = lazy(() => import("../pages/app/TemplatesPage"));
const SettingsPage = lazy(() => import("../pages/app/SettingsPage"));
const BillingPage = lazy(() => import("../pages/app/BillingPage"));
const ActivityPage = lazy(() => import("../pages/app/ActivityPage"));

const AdminDashboardPage = lazy(() => import("../pages/admin/AdminDashboardPage"));
const UsersPage = lazy(() => import("../pages/admin/UsersPage"));
const AddTemplatePage = lazy(() => import("../pages/admin/AddTemplatePage"));
const EditorPage = lazy(() => import("../Canvas/Editor"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "about", element: <AboutPage /> },
      { path: "signin", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "admin", element: <AdminLoginPage /> },
    ],
  },
  {
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/templates", element: <TemplatesPage /> },
      { path: "/editor", element: <EditorPage /> },
      { path: "/settings", element: <SettingsPage /> },
      { path: "/billing", element: <BillingPage /> },
      { path: "/activity", element: <ActivityPage /> },
      {
        path: "/admindashboard",
        element: (
          <RequireAdmin>
            <AdminDashboardPage />
          </RequireAdmin>
        ),
      },
      {
        path: "/users",
        element: (
          <RequireAdmin>
            <UsersPage />
          </RequireAdmin>
        ),
      },
      {
        path: "/addtemp",
        element: (
          <RequireAdmin>
            <AddTemplatePage />
          </RequireAdmin>
        ),
      },
    ],
  },
  { path: "/home", element: <Navigate to="/" replace /> },
  { path: "*", element: <NotFoundPage /> },
]);

