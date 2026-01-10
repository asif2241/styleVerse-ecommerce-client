// config/userDashboardInfo.ts (or inside the component)
import { LayoutDashboard, ShoppingBag, User, Heart, Settings, LogOut, Home } from "lucide-react";

export const userDashboardLinks = [
    {
        label: "Home",
        href: "/",
        icon: Home
    },
    {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Order History",
        href: "/dashboard/order-history",
        icon: ShoppingBag,
    },
    // Placeholder for future pages
    {
        label: "Profile",
        href: "/dashboard/profile",
        icon: User,
    },
    // {
    //     label: "Wishlist",
    //     href: "/dashboard/wishlist",
    //     icon: Heart,
    // },
    // {
    //     label: "Settings",
    //     href: "/dashboard/settings",
    //     icon: Settings,
    // },
];

// Optional: A separate link for logout
export const userLogoutLink = {
    label: "Logout",
    href: "/logout", // Replace with your actual logout route
    icon: LogOut,
};