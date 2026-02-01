import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { StaffService } from './staff.service';
import { JwtAuthGuard } from '../auth/jwt.strategy';
import { RolesGuard, Roles } from '../auth/roles.guard';

@Controller('staff')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StaffController {
    constructor(private readonly staffService: StaffService) { }

    @Get()
    @Roles('admin', 'meeting_convener')
    findAll() {
        return this.staffService.findAll();
    }

    @Get('count')
    @Roles('admin')
    getCount() {
        return this.staffService.getCount();
    }

    @Get(':id')
    @Roles('admin', 'meeting_convener')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.staffService.findOne(id);
    }

    @Post()
    @Roles('admin')
    create(
        @Body() data: { StaffName: string; MobileNo?: string; EmailAddress?: string; Remarks?: string }
    ) {
        return this.staffService.create(data);
    }

    @Put(':id')
    @Roles('admin')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: { StaffName?: string; MobileNo?: string; EmailAddress?: string; Remarks?: string }
    ) {
        return this.staffService.update(id, data);
    }

    @Delete(':id')
    @Roles('admin')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.staffService.delete(id);
    }
}
