import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StaffService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.staff.findMany({
            orderBy: { StaffName: 'asc' },
        });
    }

    async findOne(id: number) {
        return this.prisma.staff.findUnique({
            where: { StaffID: id },
            include: {
                meetingmember: {
                    include: {
                        meetings: {
                            include: {
                                meetingtype: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async create(data: { StaffName: string; MobileNo?: string; EmailAddress?: string; Remarks?: string }) {
        return this.prisma.staff.create({
            data,
        });
    }

    async update(id: number, data: { StaffName?: string; MobileNo?: string; EmailAddress?: string; Remarks?: string }) {
        return this.prisma.staff.update({
            where: { StaffID: id },
            data: {
                ...data,
                Modified: new Date(),
            },
        });
    }

    async delete(id: number) {
        // First delete associated meeting members
        await this.prisma.meetingmember.deleteMany({
            where: { StaffID: id },
        });
        return this.prisma.staff.delete({
            where: { StaffID: id },
        });
    }

    async getCount() {
        return this.prisma.staff.count();
    }
}
