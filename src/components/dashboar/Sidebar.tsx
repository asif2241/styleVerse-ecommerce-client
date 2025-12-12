"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // Assuming you have shadcn's utility, or use standard clsx
import { X } from "lucide-react";
import { dashboardLinks } from "@/config/sidebar.config";

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
    const pathname = usePathname();

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
                    "fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header / Logo */}
                <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100">
                    <span className="text-xl font-bold text-gray-900">AdminPanel</span>
                    <button onClick={() => setIsOpen(false)} className="lg:hidden">
                        <X className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-1 px-3 py-6">
                    {dashboardLinks.map((link) => {
                        const Icon = link.icon;
                        // Check if current path starts with the link href (for nested active states)
                        // Or exact match for dashboard home
                        const isActive =
                            link.href === "/admin/dashboard"
                                ? pathname === link.href
                                : pathname.startsWith(link.href);

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)} // Close sidebar on mobile click
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                                    isActive
                                        ? "bg-gray-900 text-white"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;