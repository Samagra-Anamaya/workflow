import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Schedule } from '@prisma/client';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async createSchedule(data: any): Promise<Schedule> {
    const _data = {
      ...data,
      // location: {
      //   connect: { spdpVillageId: data.locationId },
      // },
      // assignedBy: {
      //   connect: { userId: data.assignerId },
      // },
    };

    const schedule = await this.prisma.schedule.create({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      data: _data,
    });

    // const enumerator = await this.prisma.user.findUnique({
    //   where: {
    //     userId: _data?.enumeratorId,
    //   },
    // });
    const enumerator = await this.prisma.user.update({
      where: {
        userId: _data?.enumeratorId,
      },
      data: {
        surveyAssigned: { increment: 1 },
      },
    });
    console.log({ enumerator });
    return schedule;
  }

  async getAllSchedules(): Promise<Schedule[]> {
    return this.prisma.schedule.findMany({
      include: {
        location: {},
        assignedBy: {},
      },
    });
  }

  async getScheduleByEnumerator(id: string): Promise<any[]> {
    return this.prisma.villageData.findMany({
      where: {
        spdpVillageId: Number(id),
      },
    });
    // return this.prisma.schedule.findMany({
    //   where: { enumeratorId: id },
    //   include: {
    //     location: {},
    //     assignedBy: {},
    //   },
    // });
  }

  // async updateSubmission(
  //   id: number,
  //   data: Prisma.SubmissionUpdateInput,
  // ): Promise<Schedule | null> {
  //   return this.prisma.schedule.update({
  //     where: { id },
  //     data,
  //   });
  // }

  // async deleteSubmission(id: number): Promise<Schedule | null> {
  //   return this.prisma.schedule.delete({
  //     where: { id },
  //   });
  // }
}
