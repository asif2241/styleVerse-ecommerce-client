"use client";

import { useState } from "react";
import UserSidebar from "@/components/user/UserSidebar"; // Adjust import path
import { Menu } from "lucide-react";

export default function UserDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">

            {/* 1. Mobile Header (Only visible on small screens) */}
            <header className="lg:hidden flex items-center h-16 px-4 bg-white border-b border-gray-200 sticky top-0 z-30">
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 -ml-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                    <Menu className="h-6 w-6" />
                </button>
                <span className="ml-4 text-lg font-semibold text-indigo-600">My Account</span>
            </header>

            {/* 2. Main Content Wrapper */}
            <div className="flex max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

                {/* 3. RENDER THE SIDEBAR ONLY ONCE. 
            The UserSidebar component itself must handle the mobile fixed state 
            and the desktop static state internally using Tailwind classes.
        */}
                <UserSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

                {/* Page Content */}
                <main className="flex-1 lg:ml-8 bg-white p-6 rounded-xl shadow-md border border-gray-100 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}