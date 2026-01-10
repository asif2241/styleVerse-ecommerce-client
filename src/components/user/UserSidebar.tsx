"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { userDashboardLinks, userLogoutLink } from "@/config/userDashboardInfo";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { authApi, useLogoutMutation } from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hook";

interface UserSidebarProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

const UserSidebar = ({ isOpen, setIsOpen }: UserSidebarProps) => {
    const pathname = usePathname();
    const [logout] = useLogoutMutation();
    const dispatch = useAppDispatch();
    const router = useRouter()

    const handleLogout = async () => {
        await logout(undefined);
        dispatch(authApi.util.resetApiState());
        router.push("/")

    };


    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Container */}
            <aside
                className={cn(
                    // Mobile: Fixed overlay
                    "fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out",
                    // Desktop: Sticky behavior
                    "lg:sticky lg:translate-x-0 lg:z-30",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header / Logo - Consistent with Admin Sidebar */}
                <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100">
                    <span className="text-xl font-bold text-gray-900">My Account</span>
                    <button onClick={() => setIsOpen(false)} className="lg:hidden">
                        <X className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col justify-between h-[calc(100vh-64px)] px-3 py-6">
                    <div className="space-y-1">
                        {userDashboardLinks.map((link) => {
                            const Icon = link.icon;
                            // Consistent active state logic
                            const isActive = link.href === "/dashboard"
                                ? pathname === link.href
                                : pathname.startsWith(link.href);

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                                        isActive
                                            ? "bg-gray-900 text-white" // Changed from indigo to gray-900
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Logout Link at the bottom */}
                    <div className="pt-4 border-t border-gray-100">
                        <Button
                            onClick={handleLogout}
                            className="flex items-center w-full gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors text-red-600 hover:bg-red-50"
                        >
                            <userLogoutLink.icon className="h-5 w-5" />
                            {userLogoutLink.label}
                        </Button>
                    </div>
                </nav>
            </aside>
        </>
    );
};

export default UserSidebar;