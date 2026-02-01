"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { StatsCardSkeleton, CardSkeleton } from "@/components/ui/LoadingSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import {
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    ArrowRight,
} from "lucide-react";
import api from "@/lib/api";

interface MeetingMember {
    MeetingMemberID: number;
    IsPresent: boolean | null;
    meetings: {
        MeetingID: number;
        MeetingDate: string;
        MeetingDescription: string;
        IsCancelled: boolean;
        meetingtype: { MeetingTypeName: string };
    };
}

export default function StaffDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalAssigned: 0,
        attended: 0,
        upcoming: 0,
    });
    const [meetings, setMeetings] = useState<MeetingMember[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, meetingsRes] = await Promise.all([
                    api.get("/meetings/my-stats"),
                    api.get("/meetings/my-meetings"),
                ]);
                setStats(statsRes.data);
                setMeetings(meetingsRes.data || []);
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

    const getAttendanceBadge = (member: MeetingMember) => {
        if (member.IsPresent === true) {
            return (
                <Badge variant="success" size="sm">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Present
                </Badge>
            );
        }
        if (member.IsPresent === false) {
            return (
                <Badge variant="error" size="sm">
                    <XCircle className="w-3 h-3 mr-1" />
                    Absent
                </Badge>
            );
        }
        return (
            <Badge variant="warning" size="sm">
                <AlertCircle className="w-3 h-3 mr-1" />
                Pending
            </Badge>
        );
    };

    const statsCards = [
        {
            title: "Total Assigned",
            value: stats.totalAssigned,
            icon: <Calendar className="w-6 h-6 text-indigo-600" />,
            color: "border-l-indigo-500",
        },
        {
            title: "Attended",
            value: stats.attended,
            icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
            color: "border-l-emerald-500",
        },
        {
            title: "Upcoming",
            value: stats.upcoming,
            icon: <Clock className="w-6 h-6 text-amber-600" />,
            color: "border-l-amber-500",
        },
    ];

    const upcomingMeetings = meetings.filter(
        (m) => m.IsPresent === null && !m.meetings.IsCancelled
    );
    const pastMeetings = meetings.filter((m) => m.IsPresent !== null);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">My Dashboard</h1>
                <p className="text-slate-500">View your assigned meetings and attendance</p>
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
                        href="/dashboard/staff/meetings"
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                    >
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                ) : upcomingMeetings.length === 0 ? (
                    <Card>
                        <EmptyState
                            type="meetings"
                            title="No upcoming meetings"
                            description="You don't have any upcoming meetings assigned."
                        />
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {upcomingMeetings.slice(0, 4).map((member) => (
                            <Link
                                key={member.MeetingMemberID}
                                href={`/dashboard/staff/meetings/${member.meetings.MeetingID}`}
                            >
                                <Card hover className="h-full">
                                    <CardContent>
                                        <div className="flex items-start justify-between mb-3">
                                            <Badge variant="info" size="sm">
                                                {member.meetings.meetingtype?.MeetingTypeName || "Meeting"}
                                            </Badge>
                                            {getAttendanceBadge(member)}
                                        </div>
                                        <h3 className="font-semibold text-slate-800 mb-2">
                                            {member.meetings.MeetingDescription || "No description"}
                                        </h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(member.meetings.MeetingDate)}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                {formatTime(member.meetings.MeetingDate)}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Past Meetings */}
            <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Meetings</h2>
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.from({ length: 2 }).map((_, i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                ) : pastMeetings.length === 0 ? (
                    <Card>
                        <EmptyState
                            type="meetings"
                            title="No past meetings"
                            description="Your meeting history will appear here."
                        />
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pastMeetings.slice(0, 4).map((member) => (
                            <Link
                                key={member.MeetingMemberID}
                                href={`/dashboard/staff/meetings/${member.meetings.MeetingID}`}
                            >
                                <Card hover className="h-full">
                                    <CardContent>
                                        <div className="flex items-start justify-between mb-3">
                                            <Badge variant="info" size="sm">
                                                {member.meetings.meetingtype?.MeetingTypeName || "Meeting"}
                                            </Badge>
                                            {getAttendanceBadge(member)}
                                        </div>
                                        <h3 className="font-semibold text-slate-800 mb-2">
                                            {member.meetings.MeetingDescription || "No description"}
                                        </h3>
                                        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(member.meetings.MeetingDate)}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                {formatTime(member.meetings.MeetingDate)}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
