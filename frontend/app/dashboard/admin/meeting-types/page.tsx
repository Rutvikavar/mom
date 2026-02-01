"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/Table";
import { TableSkeleton } from "@/components/ui/LoadingSkeleton";
import { useToast } from "@/components/ui/Toast";
import { Plus, Edit2, Trash2, FolderOpen } from "lucide-react";
import api from "@/lib/api";

interface MeetingType {
    MeetingTypeID: number;
    MeetingTypeName: string;
    Remarks: string | null;
}

export default function MeetingTypesPage() {
    const [meetingTypes, setMeetingTypes] = useState<MeetingType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingType, setEditingType] = useState<MeetingType | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [typeToDelete, setTypeToDelete] = useState<MeetingType | null>(null);
    const [saving, setSaving] = useState(false);
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        MeetingTypeName: "",
        Remarks: "",
    });

    const fetchMeetingTypes = async () => {
        try {
            const response = await api.get("/meeting-types");
            setMeetingTypes(response.data);
        } catch (error) {
            console.error("Failed to fetch meeting types:", error);
            addToast("error", "Failed to fetch meeting types");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMeetingTypes();
    }, []);

    const handleOpenModal = (type?: MeetingType) => {
        if (type) {
            setEditingType(type);
            setFormData({
                MeetingTypeName: type.MeetingTypeName,
                Remarks: type.Remarks || "",
            });
        } else {
            setEditingType(null);
            setFormData({ MeetingTypeName: "", Remarks: "" });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingType) {
                await api.put(`/meeting-types/${editingType.MeetingTypeID}`, formData);
                addToast("success", "Meeting type updated successfully");
            } else {
                await api.post("/meeting-types", formData);
                addToast("success", "Meeting type created successfully");
            }
            setIsModalOpen(false);
            fetchMeetingTypes();
        } catch (error: any) {
            addToast("error", error.response?.data?.message || "Failed to save meeting type");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!typeToDelete) return;
        try {
            await api.delete(`/meeting-types/${typeToDelete.MeetingTypeID}`);
            addToast("success", "Meeting type deleted successfully");
            setIsDeleteModalOpen(false);
            setTypeToDelete(null);
            fetchMeetingTypes();
        } catch (error: any) {
            addToast("error", error.response?.data?.message || "Failed to delete meeting type");
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Meeting Types</h1>
                    <p className="text-slate-500">Configure meeting categories for your organization</p>
                </div>
                <Button icon={<Plus className="w-4 h-4" />} onClick={() => handleOpenModal()}>
                    Add Meeting Type
                </Button>
            </div>

            {/* Meeting Types Table */}
            {loading ? (
                <TableSkeleton rows={5} />
            ) : meetingTypes.length === 0 ? (
                <Card>
                    <EmptyState
                        type="meetings"
                        title="No meeting types"
                        description="Create your first meeting type to start organizing meetings."
                        actionLabel="Add Meeting Type"
                        onAction={() => handleOpenModal()}
                    />
                </Card>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow hover={false}>
                            <TableHead>Meeting Type</TableHead>
                            <TableHead>Remarks</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {meetingTypes.map((type) => (
                            <TableRow key={type.MeetingTypeID}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-indigo-100">
                                            <FolderOpen className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <span className="font-medium text-slate-800">{type.MeetingTypeName}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-slate-600">{type.Remarks || "—"}</span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleOpenModal(type)}
                                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-indigo-600 transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setTypeToDelete(type);
                                                setIsDeleteModalOpen(true);
                                            }}
                                            className="p-2 rounded-lg hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingType ? "Edit Meeting Type" : "Add Meeting Type"}
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Meeting Type Name"
                        value={formData.MeetingTypeName}
                        onChange={(e) => setFormData({ ...formData, MeetingTypeName: e.target.value })}
                        placeholder="e.g., Board Meeting"
                        required
                    />
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-700 ml-1">
                            Remarks (Optional)
                        </label>
                        <textarea
                            value={formData.Remarks}
                            onChange={(e) => setFormData({ ...formData, Remarks: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-none"
                            rows={3}
                            placeholder="Add any notes about this meeting type..."
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={saving}>
                            {editingType ? "Update" : "Create"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete Meeting Type"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-slate-600">
                        Are you sure you want to delete <strong>{typeToDelete?.MeetingTypeName}</strong>? Any
                        meetings using this type may be affected.
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
