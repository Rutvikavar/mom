"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { StatsCardSkeleton } from "@/components/ui/LoadingSkeleton";
import {
    Users,
    Calendar,
    FolderOpen,
    TrendingUp,
    ArrowUpRight,
    Clock,
    CheckCircle,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

interface Stats {
    totalMeetings: number;
    totalStaff: number;
    meetingTypes: number;
    monthlyMeetings: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [meetingsRes, staffRes, typesRes] = await Promise.all([
                    api.get("/meetings/stats"),
                    api.get("/staff/count"),
                    api.get("/meeting-types/count"),
                ]);
                setStats({
                    totalMeetings: meetingsRes.data.totalMeetings || 0,
                    totalStaff: staffRes.data || 0,
                    meetingTypes: typesRes.data || 0,
                    monthlyMeetings: meetingsRes.data.monthlyMeetings || 0,
                });
            } catch (error) {
                console.error("Failed to fetch stats:", error);
                setStats({ totalMeetings: 0, totalStaff: 0, meetingTypes: 0, monthlyMeetings: 0 });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statsCards = [
        {
            title: "Total Meetings",
            value: stats?.totalMeetings ?? 0,
            icon: <Calendar className="w-6 h-6 text-indigo-600" />,
            color: "border-l-indigo-500",
        },
        {
            title: "Total Staff",
            value: stats?.totalStaff ?? 0,
            icon: <Users className="w-6 h-6 text-emerald-600" />,
            color: "border-l-emerald-500",
        },
        {
            title: "Meeting Types",
            value: stats?.meetingTypes ?? 0,
            icon: <FolderOpen className="w-6 h-6 text-purple-600" />,
            color: "border-l-purple-500",
        },
        {
            title: "This Month",
            value: stats?.monthlyMeetings ?? 0,
            icon: <TrendingUp className="w-6 h-6 text-amber-600" />,
            color: "border-l-amber-500",
        },
    ];

    const quickActions = [
        {
            title: "Manage Users",
            description: "Add, edit, or remove users",
            href: "/dashboard/admin/users",
            icon: <Users className="w-5 h-5" />,
        },
        {
            title: "Meeting Types",
            description: "Configure meeting categories",
            href: "/dashboard/admin/meeting-types",
            icon: <FolderOpen className="w-5 h-5" />,
        },
        {
            title: "View Reports",
            description: "Download analytics reports",
            href: "/dashboard/admin/reports",
            icon: <TrendingUp className="w-5 h-5" />,
        },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
                <p className="text-slate-500">Overview of your meeting management system</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {loading
                    ? Array.from({ length: 4 }).map((_, i) => <StatsCardSkeleton key={i} />)
                    : statsCards.map((stat, index) => (
                        <Card
                            key={index}
                            variant="stats"
                            className={`${stat.color} opacity-0-init animate-slide-up`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                                    <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-slate-50">{stat.icon}</div>
                            </div>
                        </Card>
                    ))}
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                href={action.href}
                                className="group p-4 rounded-xl glass border border-white/60 hover:border-indigo-300 hover:bg-white/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg opacity-0-init animate-slide-up"
                                style={{ animationDelay: `${(index + statsCards.length) * 100}ms` }}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 group-hover:shadow-md group-hover:shadow-indigo-500/30">
                                        {action.icon}
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-slate-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <h3 className="font-medium text-slate-800">{action.title}</h3>
                                <p className="text-sm text-slate-500">{action.description}</p>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
