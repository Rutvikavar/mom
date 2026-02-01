"use client";

import { useRouter } from "next/navigation";
import { LogOut, Bell, Menu } from "lucide-react";
import Badge from "./Badge";

interface User {
    name: string;
    email: string;
    role: "admin" | "meeting_convener" | "staff";
}

interface HeaderProps {
    user: User;
    onMenuClick?: () => void;
}

export default function Header({ user, onMenuClick }: HeaderProps) {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
    };

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case "admin":
                return "admin";
            case "meeting_convener":
                return "convener";
            default:
                return "staff";
        }
    };

    const formatRole = (role: string) => {
        return role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="h-16 bg-white/80 backdrop-blur-lg border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
            {/* Left Side */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-lg font-semibold text-slate-800">
                        Welcome back, {user.name?.split(" ")[0] || "User"}
                    </h1>
                    <p className="text-sm text-slate-500">
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </p>
                </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 relative transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Divider */}
                <div className="w-px h-8 bg-slate-200"></div>

                {/* User Profile */}
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-slate-800">{user.name || "User"}</p>
                        <Badge variant={getRoleBadgeVariant(user.role)} size="sm">
                            {formatRole(user.role)}
                        </Badge>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-medium">
                        {getInitials(user.name || "U")}
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors"
                    title="Sign out"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
}
