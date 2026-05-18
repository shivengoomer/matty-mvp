import {
  LayoutDashboard,
  Layers3,
  PenSquare,
  Activity,
  CreditCard,
  Settings,
  Users,
  Shield,
  PlusCircle,
} from "lucide-react";

export const appNav = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, roles: ["user", "admin"] },
  { label: "Templates", path: "/templates", icon: Layers3, roles: ["user", "admin"] },
  { label: "Editor", path: "/editor", icon: PenSquare, roles: ["user", "admin"] },
  { label: "Activity", path: "/activity", icon: Activity, roles: ["user", "admin"] },
  { label: "Billing", path: "/billing", icon: CreditCard, roles: ["user", "admin"] },
  { label: "Settings", path: "/settings", icon: Settings, roles: ["user", "admin"] },
  { label: "Admin", path: "/admindashboard", icon: Shield, roles: ["admin"] },
  { label: "Users", path: "/users", icon: Users, roles: ["admin"] },
  { label: "Add Template", path: "/addtemp", icon: PlusCircle, roles: ["admin"] },
];

