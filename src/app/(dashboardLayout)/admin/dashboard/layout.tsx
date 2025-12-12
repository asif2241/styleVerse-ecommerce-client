"use client"; // Needs to be client to manage mobile sidebar state

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/components/dashboar/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Mobile Header (Only visible on small screens) */}
                <header className="lg:hidden flex items-center h-16 px-4 bg-white border-b border-gray-200 sticky top-0 z-30">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 -ml-2 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <span className="ml-4 text-lg font-semibold text-gray-900">Dashboard</span>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}