import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe, Req } from '@nestjs/common';
import { MeetingsService } from './meetings.service';
import { JwtAuthGuard } from '../auth/jwt.strategy';
import { RolesGuard, Roles } from '../auth/roles.guard';

@Controller('meetings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MeetingsController {
    constructor(private readonly meetingsService: MeetingsService) { }

    @Get()
    @Roles('admin', 'meeting_convener')
    findAll() {
        return this.meetingsService.findAll();
    }

    @Get('upcoming')
    @Roles('admin', 'meeting_convener')
    findUpcoming() {
        return this.meetingsService.findUpcoming();
    }

    @Get('stats')
    @Roles('admin', 'meeting_convener')
    getStats() {
        return this.meetingsService.getStats();
    }

    @Get('my-meetings')
    @Roles('staff')
    async findMyMeetings(@Req() req: any) {
        return this.meetingsService.findByUser(req.user.userId);
    }

    @Get('my-stats')
    @Roles('staff')
    async getMyStats(@Req() req: any) {
        return this.meetingsService.getStatsForStaff(req.user.userId);
    }

    @Get(':id')
    @Roles('admin', 'meeting_convener', 'staff')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.meetingsService.findOne(id);
    }

    @Post()
    @Roles('admin', 'meeting_convener')
    create(
        @Body() data: {
            MeetingDate: Date;
            MeetingTypeID: number;
            MeetingDescription?: string;
            DocumentPath?: string;
            attendees?: number[];
        }
    ) {
        return this.meetingsService.create(data);
    }

    @Put(':id')
    @Roles('admin', 'meeting_convener')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: {
            MeetingDate?: Date;
            MeetingTypeID?: number;
            MeetingDescription?: string;
            DocumentPath?: string;
        }
    ) {
        return this.meetingsService.update(id, data);
    }

    @Put(':id/cancel')
    @Roles('admin', 'meeting_convener')
    cancel(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: { reason: string }
    ) {
        return this.meetingsService.cancel(id, data.reason);
    }

    @Put(':id/attendance')
    @Roles('admin', 'meeting_convener')
    updateAttendance(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: { attendance: { staffId: number; isPresent: boolean; remarks?: string }[] }
    ) {
        return this.meetingsService.updateAttendance(id, data.attendance);
    }

    @Post(':id/members')
    @Roles('admin', 'meeting_convener')
    addMember(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: { staffId: number }
    ) {
        return this.meetingsService.addMember(id, data.staffId);
    }

    @Delete(':id/members/:staffId')
    @Roles('admin', 'meeting_convener')
    removeMember(
        @Param('id', ParseIntPipe) id: number,
        @Param('staffId', ParseIntPipe) staffId: number
    ) {
        return this.meetingsService.removeMember(id, staffId);
    }

    @Delete(':id')
    @Roles('admin')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.meetingsService.delete(id);
    }
}
