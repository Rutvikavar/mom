import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MeetingsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.meetings.findMany({
            include: {
                meetingtype: true,
                meetingmember: {
                    include: {
                        staff: true,
                    },
                },
            },
            orderBy: { MeetingDate: 'desc' },
        });
    }

    async findUpcoming() {
        return this.prisma.meetings.findMany({
            where: {
                MeetingDate: { gte: new Date() },
                IsCancelled: false,
            },
            include: {
                meetingtype: true,
                meetingmember: {
                    include: {
                        staff: true,
                    },
                },
            },
            orderBy: { MeetingDate: 'asc' },
        });
    }

    async findByUser(userId: number) {
        // Find staff linked to this user (assuming email match)
        const user = await this.prisma.users.findUnique({ where: { user_id: userId } });
        if (!user || !user.email) return [];

        const staff = await this.prisma.staff.findFirst({
            where: { EmailAddress: user.email },
        });
        if (!staff) return [];

        return this.prisma.meetingmember.findMany({
            where: { StaffID: staff.StaffID },
            include: {
                meetings: {
                    include: {
                        meetingtype: true,
                    },
                },
            },
            orderBy: { meetings: { MeetingDate: 'desc' } },
        });
    }

    async findOne(id: number) {
        return this.prisma.meetings.findUnique({
            where: { MeetingID: id },
            include: {
                meetingtype: true,
                meetingmember: {
                    include: {
                        staff: true,
                    },
                },
            },
        });
    }

    async create(data: {
        MeetingDate: Date;
        MeetingTypeID: number;
        MeetingDescription?: string;
        DocumentPath?: string;
        attendees?: number[];
    }) {
        const { attendees, ...meetingData } = data;
        const meeting = await this.prisma.meetings.create({
            data: {
                ...meetingData,
                MeetingDate: new Date(meetingData.MeetingDate),
            },
        });

        if (attendees && attendees.length > 0) {
            await this.prisma.meetingmember.createMany({
                data: attendees.map((staffId) => ({
                    MeetingID: meeting.MeetingID,
                    StaffID: staffId,
                    IsPresent: false,
                })),
            });
        }

        return this.findOne(meeting.MeetingID);
    }

    async update(id: number, data: {
        MeetingDate?: Date;
        MeetingTypeID?: number;
        MeetingDescription?: string;
        DocumentPath?: string;
    }) {
        return this.prisma.meetings.update({
            where: { MeetingID: id },
            data: {
                ...data,
                MeetingDate: data.MeetingDate ? new Date(data.MeetingDate) : undefined,
                Modified: new Date(),
            },
        });
    }

    async cancel(id: number, reason: string) {
        return this.prisma.meetings.update({
            where: { MeetingID: id },
            data: {
                IsCancelled: true,
                CancellationDateTime: new Date(),
                CancellationReason: reason,
                Modified: new Date(),
            },
        });
    }

    async delete(id: number) {
        await this.prisma.meetingmember.deleteMany({
            where: { MeetingID: id },
        });
        return this.prisma.meetings.delete({
            where: { MeetingID: id },
        });
    }

    async updateAttendance(meetingId: number, attendance: { staffId: number; isPresent: boolean; remarks?: string }[]) {
        const updates = attendance.map((a) =>
            this.prisma.meetingmember.updateMany({
                where: { MeetingID: meetingId, StaffID: a.staffId },
                data: {
                    IsPresent: a.isPresent,
                    Remarks: a.remarks,
                    Modified: new Date(),
                },
            })
        );
        await Promise.all(updates);
        return this.findOne(meetingId);
    }

    async addMember(meetingId: number, staffId: number) {
        return this.prisma.meetingmember.create({
            data: {
                MeetingID: meetingId,
                StaffID: staffId,
                IsPresent: false,
            },
        });
    }

    async removeMember(meetingId: number, staffId: number) {
        return this.prisma.meetingmember.deleteMany({
            where: { MeetingID: meetingId, StaffID: staffId },
        });
    }

    async getStats() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [totalMeetings, upcomingMeetings, monthlyMeetings, cancelledMeetings] = await Promise.all([
            this.prisma.meetings.count(),
            this.prisma.meetings.count({ where: { MeetingDate: { gte: now }, IsCancelled: false } }),
            this.prisma.meetings.count({ where: { MeetingDate: { gte: startOfMonth }, IsCancelled: false } }),
            this.prisma.meetings.count({ where: { IsCancelled: true } }),
        ]);

        return { totalMeetings, upcomingMeetings, monthlyMeetings, cancelledMeetings };
    }

    async getStatsForStaff(userId: number) {
        const user = await this.prisma.users.findUnique({ where: { user_id: userId } });
        if (!user || !user.email) return { totalAssigned: 0, attended: 0, upcoming: 0 };

        const staff = await this.prisma.staff.findFirst({
            where: { EmailAddress: user.email },
        });
        if (!staff) return { totalAssigned: 0, attended: 0, upcoming: 0 };

        const now = new Date();
        const [totalAssigned, attended, upcoming] = await Promise.all([
            this.prisma.meetingmember.count({ where: { StaffID: staff.StaffID } }),
            this.prisma.meetingmember.count({ where: { StaffID: staff.StaffID, IsPresent: true } }),
            this.prisma.meetingmember.count({
                where: {
                    StaffID: staff.StaffID,
                    meetings: { MeetingDate: { gte: now }, IsCancelled: false },
                },
            }),
        ]);

        return { totalAssigned, attended, upcoming };
    }
}
