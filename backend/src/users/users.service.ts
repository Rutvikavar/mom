import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { users_role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.users.findMany({
            select: {
                user_id: true,
                name: true,
                email: true,
                role: true,
            },
        });
    }

    async findOne(id: number) {
        return this.prisma.users.findUnique({
            where: { user_id: id },
            select: {
                user_id: true,
                name: true,
                email: true,
                role: true,
            },
        });
    }

    async create(data: { name: string; email: string; password: string; role: users_role }) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        return this.prisma.users.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: data.role,
            },
            select: {
                user_id: true,
                name: true,
                email: true,
                role: true,
            },
        });
    }

    async update(id: number, data: { name?: string; email?: string; password?: string; role?: users_role }) {
        const updateData: any = { ...data };
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }
        return this.prisma.users.update({
            where: { user_id: id },
            data: updateData,
            select: {
                user_id: true,
                name: true,
                email: true,
                role: true,
            },
        });
    }

    async delete(id: number) {
        return this.prisma.users.delete({
            where: { user_id: id },
        });
    }

    async getStats() {
        const [totalUsers, adminCount, convenerCount, staffCount] = await Promise.all([
            this.prisma.users.count(),
            this.prisma.users.count({ where: { role: 'admin' } }),
            this.prisma.users.count({ where: { role: 'meeting_convener' } }),
            this.prisma.users.count({ where: { role: 'staff' } }),
        ]);
        return { totalUsers, adminCount, convenerCount, staffCount };
    }
}
