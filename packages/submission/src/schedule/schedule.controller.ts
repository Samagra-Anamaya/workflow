import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Schedule } from '@prisma/client';

@Controller('schedule')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Post()
  async createSubmission(@Body() data: any): Promise<any> {
    return this.scheduleService.createSchedule(data);
  }

  @Get()
  async getAllSubmissions(): Promise<Schedule[]> {
    return this.scheduleService.getAllSchedules();
  }

  // @Get(':id')
  // async getSubmissionById(@Param('id') id: number): Promise<Schedule | null> {
  //   return this.scheduleService.getSubmissionById(id);
  // }
  //   getScheduleByEnumerator
  @Get('enumerator/:id')
  async getScheduleByEnumeratorId(@Param('id') id: string): Promise<any> {
    return this.scheduleService.getScheduleByEnumerator(id);
  }
  // @Put(':id')
  // async updateSubmission(
  //   @Param('id') id: number,
  //   @Body() data: any,
  // ): Promise<any | null> {
  //   return this.scheduleService.updateSubmission(id, data);
  // }

  // @Delete(':id')
  // async deleteSubmission(@Param('id') id: number): Promise<Schedule | null> {
  //   return this.scheduleService.deleteSubmission(id);
  // }
}
