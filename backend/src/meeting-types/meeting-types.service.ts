import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MeetingTypesService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.meetingtype.findMany({
            orderBy: { MeetingTypeName: 'asc' },
        });
    }

    async findOne(id: number) {
        return this.prisma.meetingtype.findUnique({
            where: { MeetingTypeID: id },
            include: {
                meetings: true,
            },
        });
    }

    async create(data: { MeetingTypeName: string; Remarks?: string }) {
        return this.prisma.meetingtype.create({
            data,
        });
    }

    async update(id: number, data: { MeetingTypeName?: string; Remarks?: string }) {
        return this.prisma.meetingtype.update({
            where: { MeetingTypeID: id },
            data: {
                ...data,
                Modified: new Date(),
            },
        });
    }

    async delete(id: number) {
        return this.prisma.meetingtype.delete({
            where: { MeetingTypeID: id },
        });
    }

    async getCount() {
        return this.prisma.meetingtype.count();
    }
}
