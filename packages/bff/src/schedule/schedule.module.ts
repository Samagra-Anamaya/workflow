import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ScheduleController } from './schedule.controller';

@Module({
  providers: [ScheduleService, PrismaService],
  controllers: [ScheduleController],
})
export class ScheduleModule {}
