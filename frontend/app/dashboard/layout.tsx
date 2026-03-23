"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
import { ToastProvider } from "@/components/ui/Toast";

interface User {
    name: string;
    email: string;
    role: "admin" | "meeting_convener" | "staff";
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [user, setUser] = useState<User | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    // Check authentication
    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
            router.push("/login");
            return;
        }

        setUser(JSON.parse(storedUser));
    }, [router]);

    // Close mobile sidebar when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Loading state
    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-pulse text-indigo-600 font-medium">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <ToastProvider>
            <div className="min-h-screen bg-mesh-animated flex">

                {/* ================= Desktop Sidebar ================= */}
                <div className="hidden lg:block z-40 p-4 pr-0 sticky top-0 h-screen">
                    <Sidebar
                        role={user.role}
                        collapsed={sidebarCollapsed}
                        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                    />
                </div>

                {/* ================= Mobile Sidebar ================= */}
                {mobileMenuOpen && (
                    <div className="lg:hidden z-50">
                        {/* Overlay */}
                        <div
                            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        {/* Sidebar Panel */}
                        <Sidebar
                            role={user.role}
                            collapsed={false}
                            onToggleCollapse={() => setMobileMenuOpen(false)}
                        />
                    </div>
                )}

                {/* ================= Main Content ================= */}
                <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 min-w-0">

                    {/* Header */}
                    <div className="p-4 pb-0 z-30 sticky top-0">
                        <Header
                            user={user}
                            onMenuClick={() => setMobileMenuOpen(true)}
                        />
                    </div>

                    {/* Page Content */}
                    <main className="flex-1 p-6 overflow-y-auto">
                        {children}
                    </main>

                </div>
            </div>
        </ToastProvider>
    );
}