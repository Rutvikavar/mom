import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { StaffModule } from './staff/staff.module';
import { MeetingTypesModule } from './meeting-types/meeting-types.module';
import { MeetingsModule } from './meetings/meetings.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    StaffModule,
    MeetingTypesModule,
    MeetingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
