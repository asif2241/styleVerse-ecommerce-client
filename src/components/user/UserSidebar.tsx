"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // For conditional styling
import { userDashboardLinks, userLogoutLink } from "@/config/userDashboardInfo"; // Import the links
import { X } from "lucide-react";

interface UserSidebarProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

const UserSidebar = ({ isOpen, setIsOpen }: UserSidebarProps) => {
    const pathname = usePathname();

    const renderLink = (link: typeof userDashboardLinks[0]) => {
        const Icon = link.icon;
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
                        ? "bg-indigo-600 text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600"
                )}
            >
                <Icon className="h-5 w-5" />
                {link.label}
            </Link>
        );
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
                    "fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-auto lg:min-h-[calc(100vh-64px)]",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header / Close Button */}
                <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100 lg:hidden">
                    <span className="text-xl font-bold text-indigo-600">My Account</span>
                    <button onClick={() => setIsOpen(false)} className="lg:hidden">
                        <X className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col justify-between h-[calc(100%-64px)] lg:h-full p-4">
                    <div className="space-y-1">
                        {userDashboardLinks.map(renderLink)}
                    </div>

                    {/* Logout Link at the bottom */}
                    <div className="pt-4 border-t border-gray-100">
                        <a
                            href={userLogoutLink.href}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors text-red-600 hover:bg-red-50"
                        >
                            <userLogoutLink.icon className="h-5 w-5" />
                            {userLogoutLink.label}
                        </a>
                    </div>
                </nav>
            </aside>
        </>
    );
};

export default UserSidebar;