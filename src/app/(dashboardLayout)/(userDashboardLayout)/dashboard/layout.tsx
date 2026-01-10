"use client";

import { useState } from "react";
import UserSidebar from "@/components/user/UserSidebar"; // Adjust import path
import { Menu } from "lucide-react";

export default function UserDashboardLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Mobile Header */}
            <header className="lg:hidden flex items-center h-16 px-4 bg-white border-b border-gray-200 sticky top-0 z-30">
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 rounded-md">
                    <Menu className="h-6 w-6" />
                </button>
                <span className="ml-4 text-lg font-semibold text-gray-900">My Account</span>
            </header>

            <div className="flex flex-1 w-full max-w-7xl mx-auto lg:px-8">
                {/* Wrap Sidebar in a div that handles the sticky positioning 
                   This ensures it stays fixed relative to the viewport but stays 
                   aligned with your 'max-w-7xl' container.
                */}
                <div className="hidden lg:block sticky top-0 h-screen">
                    <UserSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                </div>

                {/* Mobile version remains fixed via its own internal classes */}
                <div className="lg:hidden">
                    <UserSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                </div>

                {/* Page Content */}
                <main className="flex-1 py-8 px-4 lg:pl-8 min-w-0">
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 min-h-[calc(100vh-4rem)]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}