import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { MeetingTypesService } from './meeting-types.service';
import { JwtAuthGuard } from '../auth/jwt.strategy';
import { RolesGuard, Roles } from '../auth/roles.guard';

@Controller('meeting-types')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MeetingTypesController {
    constructor(private readonly meetingTypesService: MeetingTypesService) { }

    @Get()
    @Roles('admin', 'meeting_convener')
    findAll() {
        return this.meetingTypesService.findAll();
    }

    @Get('count')
    @Roles('admin')
    getCount() {
        return this.meetingTypesService.getCount();
    }

    @Get(':id')
    @Roles('admin', 'meeting_convener')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.meetingTypesService.findOne(id);
    }

    @Post()
    @Roles('admin')
    create(@Body() data: { MeetingTypeName: string; Remarks?: string }) {
        return this.meetingTypesService.create(data);
    }

    @Put(':id')
    @Roles('admin')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: { MeetingTypeName?: string; Remarks?: string }
    ) {
        return this.meetingTypesService.update(id, data);
    }

    @Delete(':id')
    @Roles('admin')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.meetingTypesService.delete(id);
    }
}
