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

        return this.prisma.$transaction(async (prisma) => {
            const user = await prisma.users.create({
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

            // Keep 'staff' table synced so they appear as attendees in meetings
            await prisma.staff.create({
                data: {
                    StaffName: data.name,
                    EmailAddress: data.email,
                }
            });

            return user;
        });
    }

    async update(id: number, data: { name?: string; email?: string; password?: string; role?: users_role }) {
        const updateData: any = { ...data };
        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        return this.prisma.$transaction(async (prisma) => {
            const oldUser = await prisma.users.findUnique({ where: { user_id: id } });

            const updatedUser = await prisma.users.update({
                where: { user_id: id },
                data: updateData,
                select: {
                    user_id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            });

            if (oldUser && oldUser.email) {
                const staffUpdateData: any = {};
                if (data.name) staffUpdateData.StaffName = data.name;
                if (data.email) staffUpdateData.EmailAddress = data.email;

                if (Object.keys(staffUpdateData).length > 0) {
                    await prisma.staff.updateMany({
                        where: { EmailAddress: oldUser.email },
                        data: staffUpdateData
                    });
                }
            }

            return updatedUser;
        });
    }

    async delete(id: number) {
        return this.prisma.$transaction(async (prisma) => {
            const user = await prisma.users.findUnique({ where: { user_id: id } });

            if (user && user.email) {
                const staffs = await prisma.staff.findMany({ where: { EmailAddress: user.email } });
                for (const s of staffs) {
                    await prisma.meetingmember.deleteMany({ where: { StaffID: s.StaffID } });
                    await prisma.staff.delete({ where: { StaffID: s.StaffID } });
                }
            }

            return prisma.users.delete({
                where: { user_id: id },
            });
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
