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
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            router.push("/login");
            return;
        }
        setUser(JSON.parse(storedUser));
    }, [router]);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-pulse text-indigo-600 font-medium">Loading...</div>
            </div>
        );
    }

    return (
        <ToastProvider>
            <div className="min-h-screen bg-slate-50">
                {/* Sidebar - Desktop */}
                <div className="hidden lg:block">
                    <Sidebar role={user.role} />
                </div>

                {/* Mobile Sidebar Overlay */}
                {mobileMenuOpen && (
                    <div className="lg:hidden fixed inset-0 z-50">
                        <div
                            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        <div className="relative w-64">
                            <Sidebar role={user.role} />
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className={`transition-all duration-300 ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}`}>
                    <Header user={user} onMenuClick={() => setMobileMenuOpen(true)} />
                    <main className="p-6">
                        <div className="animate-fade-in">{children}</div>
                    </main>
                </div>
            </div>
        </ToastProvider>
    );
}
