// config/dashboardInfo.ts (or just inside the component)
import { LayoutDashboard, UserCog, PlusCircle, Settings, Home } from "lucide-react";

export const dashboardLinks = [
  {
    label: "Home",
    href: "/",
    icon: Home
  },
  {
    label: "Overview",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Manage Users",
    href: "/admin/dashboard/manage-users",
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
  {
    label: "Manage Products",
    href: "/admin/dashboard/manage-products",
    icon: Settings,
  },
  {
    label: "Manage Orders",
    href: "/admin/dashboard/manage-orders",
    icon: Settings
  },
  // You can easily add more here later
  // {
  //   label: "Settings",
  //   href: "/admin/dashboard/settings",
  //   icon: Settings,
  // },
];