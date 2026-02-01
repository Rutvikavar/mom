"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Users,
    FileText,
    Download,
    Save,
    CheckCircle,
    XCircle,
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
    CancellationReason: string | null;
    DocumentPath: string | null;
    meetingmember: Attendee[];
}

export default function MeetingDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const router = useRouter();
    const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [attendanceChanges, setAttendanceChanges] = useState<Record<number, boolean>>({});
    const [isSaving, setIsSaving] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        const fetchMeeting = async () => {
            try {
                const response = await api.get(`/meetings/${id}`);
                setMeeting(response.data);
                // Initialize attendance state
                const initialAttendance: Record<number, boolean> = {};
                response.data.meetingmember?.forEach((m: Attendee) => {
                    if (m.IsPresent !== null) {
                        initialAttendance[m.StaffID] = m.IsPresent;
                    }
                });
                setAttendanceChanges(initialAttendance);
            } catch (error) {
                console.error("Failed to fetch meeting:", error);
                addToast("error", "Failed to fetch meeting details");
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

    const handleAttendanceChange = (staffId: number, isPresent: boolean) => {
        setAttendanceChanges((prev) => ({ ...prev, [staffId]: isPresent }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const attendance = Object.entries(attendanceChanges).map(([staffId, isPresent]) => ({
                staffId: parseInt(staffId),
                isPresent,
            }));
            await api.put(`/meetings/${id}/attendance`, { attendance });
            addToast("success", "Attendance saved successfully");
        } catch (error) {
            console.error("Failed to save attendance:", error);
            addToast("error", "Failed to save attendance");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = async () => {
        try {
            await api.put(`/meetings/${id}/cancel`, { reason: cancelReason });
            addToast("success", "Meeting cancelled successfully");
            setIsCancelModalOpen(false);
            router.push("/dashboard/convener/meetings");
        } catch (error) {
            console.error("Failed to cancel meeting:", error);
            addToast("error", "Failed to cancel meeting");
        }
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
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <Link
                        href="/dashboard/convener/meetings"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Meetings
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-800">Meeting Details</h1>
                </div>
                <div className="flex gap-2">
                    {!meeting.IsCancelled && (
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setIsCancelModalOpen(true)}
                        >
                            Cancel Meeting
                        </Button>
                    )}
                    <Button
                        size="sm"
                        icon={<Save className="w-4 h-4" />}
                        onClick={handleSave}
                        loading={isSaving}
                    >
                        Save Attendance
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Meeting Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Meeting Info Card */}
                    <Card>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge variant="info">{meeting.meetingtype?.MeetingTypeName}</Badge>
                                {meeting.IsCancelled ? (
                                    <Badge variant="error">
                                        <XCircle className="w-3 h-3 mr-1" />
                                        Cancelled
                                    </Badge>
                                ) : (
                                    <Badge variant="success">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Active
                                    </Badge>
                                )}
                            </div>
                            <h2 className="text-xl font-semibold text-slate-800 mb-4">
                                {meeting.MeetingDescription || "No description"}
                            </h2>
                            {meeting.CancellationReason && (
                                <p className="text-red-600 text-sm mb-4">
                                    Cancellation reason: {meeting.CancellationReason}
                                </p>
                            )}
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
                </div>

                {/* Right Column - Attendance */}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-indigo-500" />
                                Attendance
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {meeting.meetingmember?.length === 0 ? (
                                <p className="text-slate-500 text-center py-4">No attendees assigned</p>
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
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800">
                                                        {attendee.staff?.StaffName || "Unknown"}
                                                    </p>
                                                    {attendee.Remarks && (
                                                        <p className="text-xs text-slate-500">{attendee.Remarks}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleAttendanceChange(attendee.StaffID, true)}
                                                    className={`p-1.5 rounded-lg transition-colors ${attendanceChanges[attendee.StaffID] === true
                                                        ? "bg-emerald-100 text-emerald-600"
                                                        : "hover:bg-slate-200 text-slate-400"
                                                        }`}
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleAttendanceChange(attendee.StaffID, false)}
                                                    className={`p-1.5 rounded-lg transition-colors ${attendanceChanges[attendee.StaffID] === false
                                                        ? "bg-red-100 text-red-600"
                                                        : "hover:bg-slate-200 text-slate-400"
                                                        }`}
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="mt-4 pt-4 border-t border-slate-200">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Present</span>
                                    <span className="font-medium text-emerald-600">
                                        {Object.values(attendanceChanges).filter((v) => v === true).length}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                    <span className="text-slate-600">Absent</span>
                                    <span className="font-medium text-red-600">
                                        {Object.values(attendanceChanges).filter((v) => v === false).length}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Cancel Modal */}
            <Modal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                title="Cancel Meeting"
                size="md"
            >
                <div className="space-y-4">
                    <p className="text-slate-600">
                        Are you sure you want to cancel this meeting? This action cannot be undone.
                    </p>
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-700">
                            Cancellation Reason
                        </label>
                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                            rows={3}
                            placeholder="Provide a reason for cancellation..."
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="secondary" onClick={() => setIsCancelModalOpen(false)}>
                            Keep Meeting
                        </Button>
                        <Button variant="danger" onClick={handleCancel}>
                            Cancel Meeting
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
