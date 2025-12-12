// config/dashboardInfo.ts (or just inside the component)
import { LayoutDashboard, UserCog, PlusCircle, Settings } from "lucide-react";

export const dashboardLinks = [
  {
    label: "Overview",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Manage Users",
    href: "/admin/dashboard/manage-user",
    icon: UserCog,
  },
  {
    label: "Add Category",
    href: "/admin/dashboard/add-category",
    icon: PlusCircle,
  },
  {
    label: "Add Product",
    href: "/admin/dashboard/add-product",
    icon: PlusCircle,
  },
  // You can easily add more here later
  {
    label: "Settings",
    href: "/admin/dashboard/settings",
    icon: Settings,
  },
];