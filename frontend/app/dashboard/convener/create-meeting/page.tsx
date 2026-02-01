"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DatePicker from "@/components/ui/DatePicker";
import FileUpload from "@/components/ui/FileUpload";
import { useToast } from "@/components/ui/Toast";
import { ArrowLeft, Calendar, FileText, Users, Check } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

interface Staff {
    StaffID: number;
    StaffName: string;
}

interface MeetingType {
    MeetingTypeID: number;
    MeetingTypeName: string;
}

export default function CreateMeetingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [staff, setStaff] = useState<Staff[]>([]);
    const [meetingTypes, setMeetingTypes] = useState<MeetingType[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<number[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        MeetingDate: "",
        MeetingTypeID: "",
        MeetingDescription: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [staffRes, typesRes] = await Promise.all([
                    api.get("/staff"),
                    api.get("/meeting-types"),
                ]);
                setStaff(staffRes.data);
                setMeetingTypes(typesRes.data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                addToast("error", "Failed to load form data");
            }
        };
        fetchData();
    }, []);

    const toggleStaff = (staffId: number) => {
        setSelectedStaff((prev) =>
            prev.includes(staffId)
                ? prev.filter((id) => id !== staffId)
                : [...prev, staffId]
        );
    };

    const selectAllStaff = () => {
        if (selectedStaff.length === staff.length) {
            setSelectedStaff([]);
        } else {
            setSelectedStaff(staff.map((s) => s.StaffID));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post("/meetings", {
                MeetingDate: formData.MeetingDate,
                MeetingTypeID: parseInt(formData.MeetingTypeID),
                MeetingDescription: formData.MeetingDescription,
                attendees: selectedStaff,
            });

            addToast("success", "Meeting created successfully");
            router.push("/dashboard/convener/meetings");
        } catch (error: any) {
            console.error("Failed to create meeting:", error);
            addToast("error", error.response?.data?.message || "Failed to create meeting");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl">
            {/* Page Header */}
            <div>
                <Link
                    href="/dashboard/convener"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold text-slate-800">Create New Meeting</h1>
                <p className="text-slate-500">Schedule a meeting and invite attendees</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Meeting Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-indigo-500" />
                            Meeting Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DatePicker
                                label="Meeting Date & Time"
                                value={formData.MeetingDate}
                                onChange={(value) => setFormData({ ...formData, MeetingDate: value })}
                                includeTime
                            />
                            <div className="space-y-1.5">
                                <label className="block text-sm font-medium text-slate-700 ml-1">
                                    Meeting Type
                                </label>
                                <select
                                    value={formData.MeetingTypeID}
                                    onChange={(e) =>
                                        setFormData({ ...formData, MeetingTypeID: e.target.value })
                                    }
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    required
                                >
                                    <option value="">Select a type</option>
                                    {meetingTypes.map((type) => (
                                        <option key={type.MeetingTypeID} value={type.MeetingTypeID}>
                                            {type.MeetingTypeName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-slate-700 ml-1">
                                Meeting Description
                            </label>
                            <textarea
                                value={formData.MeetingDescription}
                                onChange={(e) =>
                                    setFormData({ ...formData, MeetingDescription: e.target.value })
                                }
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                                rows={3}
                                placeholder="Provide a brief description of the meeting..."
                                required
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Attendees */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-indigo-500" />
                                Attendees
                            </CardTitle>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={selectAllStaff}
                            >
                                {selectedStaff.length === staff.length ? "Deselect All" : "Select All"}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {staff.length === 0 ? (
                            <p className="text-slate-500 text-center py-4">No staff members available</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {staff.map((member) => (
                                    <button
                                        key={member.StaffID}
                                        type="button"
                                        onClick={() => toggleStaff(member.StaffID)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${selectedStaff.includes(member.StaffID)
                                            ? "border-indigo-500 bg-indigo-50"
                                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                            }`}
                                    >
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${selectedStaff.includes(member.StaffID)
                                                ? "bg-indigo-600 text-white"
                                                : "bg-slate-200 text-slate-600"
                                                }`}
                                        >
                                            {selectedStaff.includes(member.StaffID) ? (
                                                <Check className="w-4 h-4" />
                                            ) : (
                                                member.StaffName.charAt(0)
                                            )}
                                        </div>
                                        <span
                                            className={`text-sm font-medium ${selectedStaff.includes(member.StaffID)
                                                ? "text-indigo-700"
                                                : "text-slate-700"
                                                }`}
                                        >
                                            {member.StaffName}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                        <p className="text-sm text-slate-500 mt-4">
                            {selectedStaff.length} attendee(s) selected
                        </p>
                    </CardContent>
                </Card>

                {/* File Upload */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-indigo-500" />
                            Attachments (Optional)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FileUpload
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                            multiple
                            maxSize={10}
                            onFilesChange={setFiles}
                        />
                    </CardContent>
                </Card>

                {/* Submit */}
                <div className="flex justify-end gap-4">
                    <Link href="/dashboard/convener">
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" loading={loading}>
                        Create Meeting
                    </Button>
                </div>
            </form>
        </div>
    );
}
