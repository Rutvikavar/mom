"use client";

import { useState, useEffect, use } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Users,
    FileText,
    Download,
    CheckCircle,
    XCircle,
    AlertCircle,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

interface Attendee {
    MeetingMemberID: number;
    StaffID: number;
    staff: { StaffName: string };
    IsPresent: boolean | null;
    Remarks: string;
}

interface MeetingDetail {
    MeetingID: number;
    MeetingDate: string;
    MeetingDescription: string;
    meetingtype: { MeetingTypeName: string };
    IsCancelled: boolean;
    DocumentPath: string | null;
    meetingmember: Attendee[];
}

export default function StaffMeetingDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [myAttendance, setMyAttendance] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchMeeting = async () => {
            try {
                const response = await api.get(`/meetings/${id}`);
                setMeeting(response.data);

                // Find current user's attendance (simplified - would need user context in real app)
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                const myMember = response.data.meetingmember?.find(
                    (m: Attendee) => m.staff?.StaffName === user.name
                );
                if (myMember) {
                    setMyAttendance(myMember.IsPresent);
                }
            } catch (error) {
                console.error("Failed to fetch meeting:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMeeting();
    }, [id]);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
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

    const getAttendanceBadge = () => {
        if (myAttendance === true) {
            return (
                <Badge variant="success">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    You were present
                </Badge>
            );
        }
        if (myAttendance === false) {
            return (
                <Badge variant="error">
                    <XCircle className="w-4 h-4 mr-1" />
                    You were absent
                </Badge>
            );
        }
        return (
            <Badge variant="warning">
                <AlertCircle className="w-4 h-4 mr-1" />
                Attendance pending
            </Badge>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-pulse text-indigo-600 font-medium">Loading...</div>
            </div>
        );
    }

    if (!meeting) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-500">Meeting not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <Link
                    href="/dashboard/staff"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold text-slate-800">Meeting Details</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Meeting Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Meeting Info Card */}
                    <Card>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge variant="info">{meeting.meetingtype?.MeetingTypeName}</Badge>
                                {getAttendanceBadge()}
                            </div>
                            <h2 className="text-xl font-semibold text-slate-800 mb-4">
                                {meeting.MeetingDescription || "No description"}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Calendar className="w-5 h-5 text-indigo-500" />
                                    {formatDate(meeting.MeetingDate)}
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Clock className="w-5 h-5 text-indigo-500" />
                                    {formatTime(meeting.MeetingDate)}
                                </div>
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Users className="w-5 h-5 text-indigo-500" />
                                    {meeting.meetingmember?.length || 0} attendees
                                </div>
                            </div>
                            {meeting.DocumentPath && (
                                <div className="mt-4 pt-4 border-t border-slate-200">
                                    <Button variant="secondary" size="sm" icon={<Download className="w-4 h-4" />}>
                                        Download Attachment
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Meeting Notes Placeholder */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-indigo-500" />
                                Meeting Notes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600">
                                <p>Meeting notes will be available after the meeting is completed.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Attendees */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-indigo-500" />
                                Attendees
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {meeting.meetingmember?.length === 0 ? (
                                <p className="text-slate-500 text-center py-4">No attendees</p>
                            ) : (
                                <div className="space-y-3">
                                    {meeting.meetingmember?.map((attendee) => (
                                        <div
                                            key={attendee.MeetingMemberID}
                                            className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                                                    {attendee.staff?.StaffName?.charAt(0) || "?"}
                                                </div>
                                                <p className="text-sm font-medium text-slate-800">
                                                    {attendee.staff?.StaffName || "Unknown"}
                                                </p>
                                            </div>
                                            <div>
                                                {attendee.IsPresent === true && (
                                                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                                                )}
                                                {attendee.IsPresent === false && (
                                                    <XCircle className="w-5 h-5 text-red-500" />
                                                )}
                                                {attendee.IsPresent === null && (
                                                    <AlertCircle className="w-5 h-5 text-amber-500" />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="mt-4 pt-4 border-t border-slate-200">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Present</span>
                                    <span className="font-medium text-emerald-600">
                                        {meeting.meetingmember?.filter((a) => a.IsPresent === true).length || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                    <span className="text-slate-600">Absent</span>
                                    <span className="font-medium text-red-600">
                                        {meeting.meetingmember?.filter((a) => a.IsPresent === false).length || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                    <span className="text-slate-600">Pending</span>
                                    <span className="font-medium text-amber-600">
                                        {meeting.meetingmember?.filter((a) => a.IsPresent === null).length || 0}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
