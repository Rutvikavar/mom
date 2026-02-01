"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    Calendar,
    FileText,
    Settings,
    ChevronLeft,
    ChevronRight,
    FolderOpen,
    BarChart3,
    PlusCircle,
    ClipboardList,
} from "lucide-react";

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

interface SidebarProps {
    role: "admin" | "meeting_convener" | "staff";
}

const adminNavItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard/admin", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Users", href: "/dashboard/admin/users", icon: <Users className="w-5 h-5" /> },
    { label: "Meeting Types", href: "/dashboard/admin/meeting-types", icon: <FolderOpen className="w-5 h-5" /> },
    { label: "Reports", href: "/dashboard/admin/reports", icon: <BarChart3 className="w-5 h-5" /> },
];

const convenerNavItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard/convener", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Create Meeting", href: "/dashboard/convener/create-meeting", icon: <PlusCircle className="w-5 h-5" /> },
    { label: "All Meetings", href: "/dashboard/convener/meetings", icon: <Calendar className="w-5 h-5" /> },
];

const staffNavItems: NavItem[] = [
    { label: "Dashboard", href: "/dashboard/staff", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "My Meetings", href: "/dashboard/staff/meetings", icon: <ClipboardList className="w-5 h-5" /> },
];

export default function Sidebar({ role }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    const navItems =
        role === "admin"
            ? adminNavItems
            : role === "meeting_convener"
                ? convenerNavItems
                : staffNavItems;

    const isActive = (href: string) => {
        if (href === "/dashboard/admin" || href === "/dashboard/convener" || href === "/dashboard/staff") {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <aside
            className={`
        fixed left-0 top-0 h-screen bg-white border-r border-slate-200 
        transition-all duration-300 ease-in-out z-40
        ${collapsed ? "w-20" : "w-64"}
      `}
        >
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
                {!collapsed && (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-slate-800">MOM System</span>
                    </div>
                )}
                {collapsed && (
                    <div className="w-8 h-8 mx-auto rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`
              flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
              ${isActive(item.href)
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            }
              ${collapsed ? "justify-center" : ""}
            `}
                        title={collapsed ? item.label : undefined}
                    >
                        {item.icon}
                        {!collapsed && <span className="font-medium">{item.label}</span>}
                    </Link>
                ))}
            </nav>

            {/* Collapse Button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute bottom-4 right-4 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
                {collapsed ? (
                    <ChevronRight className="w-4 h-4" />
                ) : (
                    <ChevronLeft className="w-4 h-4" />
                )}
            </button>
        </aside>
    );
}
