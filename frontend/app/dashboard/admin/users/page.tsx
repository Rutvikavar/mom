"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
    Pagination,
} from "@/components/ui/Table";
import { TableSkeleton } from "@/components/ui/LoadingSkeleton";
import { useToast } from "@/components/ui/Toast";
import { Plus, Search, Edit2, Trash2, Mail, User } from "lucide-react";
import api from "@/lib/api";

interface UserData {
    user_id: number;
    name: string;
    email: string;
    role: "admin" | "meeting_convener" | "staff";
}

export default function UsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserData | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<UserData | null>(null);
    const [saving, setSaving] = useState(false);
    const { addToast } = useToast();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "staff" as "admin" | "meeting_convener" | "staff",
    });

    const fetchUsers = async () => {
        try {
            const response = await api.get("/users");
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            addToast("error", "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleOpenModal = (user?: UserData) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                password: "",
                role: user.role,
            });
        } else {
            setEditingUser(null);
            setFormData({ name: "", email: "", password: "", role: "staff" });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingUser) {
                const updateData: any = { name: formData.name, email: formData.email, role: formData.role };
                if (formData.password) updateData.password = formData.password;
                await api.put(`/users/${editingUser.user_id}`, updateData);
                addToast("success", "User updated successfully");
            } else {
                await api.post("/users", formData);
                addToast("success", "User created successfully");
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error: any) {
            addToast("error", error.response?.data?.message || "Failed to save user");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!userToDelete) return;
        try {
            await api.delete(`/users/${userToDelete.user_id}`);
            addToast("success", "User deleted successfully");
            setIsDeleteModalOpen(false);
            setUserToDelete(null);
            fetchUsers();
        } catch (error: any) {
            addToast("error", error.response?.data?.message || "Failed to delete user");
        }
    };

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case "admin":
                return "admin";
            case "meeting_convener":
                return "convener";
            default:
                return "staff";
        }
    };

    const formatRole = (role: string) => {
        return role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
                    <p className="text-slate-500">Manage system users and their roles</p>
                </div>
                <Button icon={<Plus className="w-4 h-4" />} onClick={() => handleOpenModal()}>
                    Add User
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="py-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                icon={<Search className="w-5 h-5" />}
                            />
                        </div>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="meeting_convener">Meeting Convener</option>
                            <option value="staff">Staff</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            {loading ? (
                <TableSkeleton rows={5} />
            ) : filteredUsers.length === 0 ? (
                <Card>
                    <EmptyState
                        type="users"
                        title="No users found"
                        description="Try adjusting your search or filter to find what you're looking for."
                    />
                </Card>
            ) : (
                <div>
                    <Table>
                        <TableHeader>
                            <TableRow hover={false}>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedUsers.map((user) => (
                                <TableRow key={user.user_id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium">
                                                {user.name?.charAt(0).toUpperCase() || "U"}
                                            </div>
                                            <span className="font-medium text-slate-800">{user.name || "N/A"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-slate-600">{user.email}</span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getRoleBadgeVariant(user.role)} size="sm">
                                            {formatRole(user.role)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenModal(user)}
                                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-indigo-600 transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setUserToDelete(user);
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
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </div>
            )}

            {/* Add/Edit User Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingUser ? "Edit User" : "Add New User"}
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        icon={<User className="w-5 h-5" />}
                        placeholder="John Doe"
                        required
                    />
                    <Input
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        icon={<Mail className="w-5 h-5" />}
                        placeholder="john@example.com"
                        required
                    />
                    <Input
                        label={editingUser ? "Password (leave blank to keep current)" : "Password"}
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                        required={!editingUser}
                    />
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-700 ml-1">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    role: e.target.value as "admin" | "meeting_convener" | "staff",
                                })
                            }
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        >
                            <option value="staff">Staff</option>
                            <option value="meeting_convener">Meeting Convener</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={saving}>
                            {editingUser ? "Update User" : "Create User"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="Delete User"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-slate-600">
                        Are you sure you want to delete <strong>{userToDelete?.name}</strong>? This action
                        cannot be undone.
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
