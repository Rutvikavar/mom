"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import DatePicker from "@/components/ui/DatePicker";
import {
    FileText,
    Download,
    Calendar,
    Users,
    BarChart3,
    TrendingUp,
} from "lucide-react";

interface ReportType {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    formats: string[];
}

const reportTypes: ReportType[] = [
    {
        id: "meetings",
        title: "Meetings Report",
        description: "Complete list of all meetings with details and attendance",
        icon: <Calendar className="w-6 h-6 text-indigo-600" />,
        formats: ["CSV", "PDF"],
    },
    {
        id: "attendance",
        title: "Attendance Report",
        description: "Staff attendance records across all meetings",
        icon: <Users className="w-6 h-6 text-emerald-600" />,
        formats: ["CSV", "PDF"],
    },
    {
        id: "monthly",
        title: "Monthly Summary",
        description: "Monthly breakdown of meeting statistics",
        icon: <BarChart3 className="w-6 h-6 text-purple-600" />,
        formats: ["CSV", "PDF"],
    },
    {
        id: "analytics",
        title: "Analytics Report",
        description: "Detailed analytics with trends and insights",
        icon: <TrendingUp className="w-6 h-6 text-amber-600" />,
        formats: ["PDF"],
    },
];

export default function ReportsPage() {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [downloading, setDownloading] = useState<string | null>(null);

    const handleDownload = async (reportId: string, format: string) => {
        setDownloading(`${reportId}-${format}`);
        // Simulate download delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log(`Downloading ${reportId} in ${format} format`);
        setDownloading(null);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
                <p className="text-slate-500">Generate and download system reports</p>
            </div>

            {/* Date Filter */}
            <Card>
                <CardHeader>
                    <CardTitle>Date Range Filter</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={setStartDate}
                            />
                        </div>
                        <div className="flex-1">
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={setEndDate}
                            />
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 mt-3">
                        Leave empty to include all available data
                    </p>
                </CardContent>
            </Card>

            {/* Report Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reportTypes.map((report) => (
                    <Card key={report.id} hover>
                        <CardContent>
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-slate-100">{report.icon}</div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-slate-800 mb-1">{report.title}</h3>
                                    <p className="text-sm text-slate-500 mb-4">{report.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {report.formats.map((format) => (
                                            <Button
                                                key={format}
                                                variant="secondary"
                                                size="sm"
                                                loading={downloading === `${report.id}-${format}`}
                                                icon={<Download className="w-4 h-4" />}
                                                onClick={() => handleDownload(report.id, format)}
                                            >
                                                {format}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Quick Stats */}
            <Card variant="gradient">
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-white/50">
                            <FileText className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800">Need a Custom Report?</h3>
                            <p className="text-sm text-slate-600">
                                Contact the system administrator for custom report requirements.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
