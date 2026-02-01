import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.strategy';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { users_role } from '@prisma/client';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @Roles('admin')
    findAll() {
        return this.usersService.findAll();
    }

    @Get('stats')
    @Roles('admin')
    getStats() {
        return this.usersService.getStats();
    }

    @Get(':id')
    @Roles('admin')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findOne(id);
    }

    @Post()
    @Roles('admin')
    create(
        @Body() data: { name: string; email: string; password: string; role: users_role }
    ) {
        return this.usersService.create(data);
    }

    @Put(':id')
    @Roles('admin')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: { name?: string; email?: string; password?: string; role?: users_role }
    ) {
        return this.usersService.update(id, data);
    }

    @Delete(':id')
    @Roles('admin')
    delete(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.delete(id);
    }
}
