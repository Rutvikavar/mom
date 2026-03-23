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
    collapsed?: boolean;
    onToggleCollapse?: () => void;
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

export default function Sidebar({ role, collapsed: extCollapsed, onToggleCollapse }: SidebarProps) {
    const [intCollapsed, setIntCollapsed] = useState(false);
    const pathname = usePathname();

    const isControlled = extCollapsed !== undefined;
    const collapsed = isControlled ? extCollapsed : intCollapsed;

    const toggleCollapse = () => {
        if (isControlled && onToggleCollapse) {
            onToggleCollapse();
        } else {
            setIntCollapsed(!intCollapsed);
        }
    };

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
        sticky left-4 top-4 h-[calc(100vh-2rem)] glass border border-white/40 shadow-xl shadow-indigo-500/5 rounded-2xl
        transition-all duration-300 ease-in-out z-40 flex flex-col
        ${collapsed ? "w-20" : "w-64"}
      `}
        >
            {/* Logo */}
            <div className="h-16 flex-shrink-0 flex items-center justify-between px-4 border-b border-white/20">
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
            <nav className="p-4 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`
              flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group
              ${isActive(item.href)
                                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30 font-medium scale-[1.02]"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent hover:border-slate-200"
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
                onClick={toggleCollapse}
                className="hidden lg:block absolute bottom-4 right-4 p-2 rounded-lg bg-white/50 hover:bg-white/80 border border-slate-200 text-slate-600 transition-colors shadow-sm"
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
