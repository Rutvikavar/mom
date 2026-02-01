"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/LoadingSkeleton";
import {
    Plus,
    Search,
    Calendar,
    Clock,
    Users,
    CheckCircle,
    XCircle,
    AlertCircle,
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

export default function MeetingsPage() {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const response = await api.get("/meetings");
                setMeetings(response.data);
            } catch (error) {
                console.error("Failed to fetch meetings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMeetings();
    }, []);

    const filteredMeetings = meetings.filter((meeting) => {
        const matchesSearch = meeting.MeetingDescription?.toLowerCase().includes(
            searchQuery.toLowerCase()
        );
        const isCompleted = new Date(meeting.MeetingDate) < new Date();
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "upcoming" && !isCompleted && !meeting.IsCancelled) ||
            (statusFilter === "completed" && isCompleted) ||
            (statusFilter === "cancelled" && meeting.IsCancelled);
        const matchesType =
            typeFilter === "all" || meeting.meetingtype?.MeetingTypeName === typeFilter;
        return matchesSearch && matchesStatus && matchesType;
    });

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusBadge = (meeting: Meeting) => {
        if (meeting.IsCancelled) {
            return (
                <Badge variant="error" size="sm">
                    <XCircle className="w-3 h-3 mr-1" />
                    Cancelled
                </Badge>
            );
        }
        const isCompleted = new Date(meeting.MeetingDate) < new Date();
        if (isCompleted) {
            return (
                <Badge variant="success" size="sm">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                </Badge>
            );
        }
        return (
            <Badge variant="warning" size="sm">
                <AlertCircle className="w-3 h-3 mr-1" />
                Upcoming
            </Badge>
        );
    };

    const meetingTypes = [...new Set(meetings.map((m) => m.meetingtype?.MeetingTypeName).filter(Boolean))];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">All Meetings</h1>
                    <p className="text-slate-500">View and manage all your meetings</p>
                </div>
                <Link href="/dashboard/convener/create-meeting">
                    <Button icon={<Plus className="w-4 h-4" />}>Create Meeting</Button>
                </Link>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="py-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search meetings..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                icon={<Search className="w-5 h-5" />}
                            />
                        </div>
                        <div className="flex gap-4">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            >
                                <option value="all">All Status</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                            >
                                <option value="all">All Types</option>
                                {meetingTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Meetings Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <CardSkeleton key={i} />
                    ))}
                </div>
            ) : filteredMeetings.length === 0 ? (
                <Card>
                    <EmptyState
                        type="meetings"
                        title="No meetings found"
                        description="Try adjusting your filters or create a new meeting."
                        actionLabel="Create Meeting"
                        onAction={() => { }}
                    />
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMeetings.map((meeting) => (
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
                                        {getStatusBadge(meeting)}
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
    );
}
