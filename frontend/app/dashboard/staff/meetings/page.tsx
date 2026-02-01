"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/LoadingSkeleton";
import {
    Search,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
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

export default function StaffMeetingsPage() {
    const [meetings, setMeetings] = useState<MeetingMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const response = await api.get("/meetings/my-meetings");
                setMeetings(response.data || []);
            } catch (error) {
                console.error("Failed to fetch meetings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMeetings();
    }, []);

    const filteredMeetings = meetings.filter((member) => {
        const matchesSearch = member.meetings.MeetingDescription?.toLowerCase().includes(
            searchQuery.toLowerCase()
        );
        const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "pending" && member.IsPresent === null) ||
            (statusFilter === "present" && member.IsPresent === true) ||
            (statusFilter === "absent" && member.IsPresent === false);
        return matchesSearch && matchesStatus;
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

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">My Meetings</h1>
                <p className="text-slate-500">View all meetings you are assigned to</p>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="py-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search meetings..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                icon={<Search className="w-5 h-5" />}
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Meetings List */}
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
                        description="Try adjusting your search or filter."
                    />
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMeetings.map((member) => (
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
                                    <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2">
                                        {member.meetings.MeetingDescription || "No description"}
                                    </h3>
                                    <div className="space-y-2 text-sm text-slate-500">
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
    );
}
