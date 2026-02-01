"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { StatsCardSkeleton, CardSkeleton } from "@/components/ui/LoadingSkeleton";
import {
    Plus,
    Calendar,
    Clock,
    Users,
    ArrowRight,
    CheckCircle,
    XCircle,
} from "lucide-react";
import api from "@/lib/api";

interface Meeting {
    MeetingID: number;
    MeetingDate: string;
    MeetingDescription: string;
    meetingtype: { MeetingTypeName: string };
    IsCancelled: boolean;
    meetingmember: any[];
}

export default function ConvenerDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        upcomingMeetings: 0,
        thisWeek: 0,
        totalMeetings: 0,
    });
    const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, meetingsRes] = await Promise.all([
                    api.get("/meetings/stats"),
                    api.get("/meetings/upcoming"),
                ]);
                setStats({
                    upcomingMeetings: statsRes.data.upcomingMeetings || 0,
                    thisWeek: meetingsRes.data.length || 0,
                    totalMeetings: statsRes.data.totalMeetings || 0,
                });
                setUpcomingMeetings(meetingsRes.data.slice(0, 3));
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const statsCards = [
        {
            title: "Upcoming Meetings",
            value: stats.upcomingMeetings,
            icon: <Calendar className="w-6 h-6 text-indigo-600" />,
            color: "border-l-indigo-500",
        },
        {
            title: "This Week",
            value: stats.thisWeek,
            icon: <Clock className="w-6 h-6 text-emerald-600" />,
            color: "border-l-emerald-500",
        },
        {
            title: "Total Meetings",
            value: stats.totalMeetings,
            icon: <Users className="w-6 h-6 text-amber-600" />,
            color: "border-l-amber-500",
        },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Convener Dashboard</h1>
                    <p className="text-slate-500">Manage and organize your meetings</p>
                </div>
                <Link href="/dashboard/convener/create-meeting">
                    <Button icon={<Plus className="w-4 h-4" />}>Create Meeting</Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {loading
                    ? Array.from({ length: 3 }).map((_, i) => <StatsCardSkeleton key={i} />)
                    : statsCards.map((stat, index) => (
                        <Card key={index} variant="stats" className={stat.color}>
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

            {/* Upcoming Meetings */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-slate-800">Upcoming Meetings</h2>
                    <Link
                        href="/dashboard/convener/meetings"
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                    >
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                ) : upcomingMeetings.length === 0 ? (
                    <Card>
                        <CardContent className="py-8 text-center">
                            <p className="text-slate-500">No upcoming meetings</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {upcomingMeetings.map((meeting) => (
                            <Link
                                key={meeting.MeetingID}
                                href={`/dashboard/convener/meetings/${meeting.MeetingID}`}
                            >
                                <Card hover className="h-full">
                                    <CardContent>
                                        <div className="flex items-start justify-between mb-3">
                                            <Badge variant="info" size="sm">
                                                {meeting.meetingtype?.MeetingTypeName || "Meeting"}
                                            </Badge>
                                            {meeting.IsCancelled ? (
                                                <XCircle className="w-5 h-5 text-red-500" />
                                            ) : (
                                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2">
                                            {meeting.MeetingDescription || "No description"}
                                        </h3>
                                        <div className="space-y-2 text-sm text-slate-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(meeting.MeetingDate)}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                {formatTime(meeting.MeetingDate)}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                {meeting.meetingmember?.length || 0} attendees
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <Card variant="gradient">
                <CardContent>
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="font-semibold text-slate-800">Ready to Schedule?</h3>
                            <p className="text-sm text-slate-600">
                                Create a new meeting and invite attendees in minutes.
                            </p>
                        </div>
                        <Link href="/dashboard/convener/create-meeting">
                            <Button icon={<Plus className="w-4 h-4" />}>Create Meeting</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
