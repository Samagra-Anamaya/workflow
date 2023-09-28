// submission.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class SubmissionService {
  constructor(private prisma: PrismaService) {}

  async createSubmission(data: Prisma.SubmissionCreateInput): Promise<any> {
    const submission = await this.prisma.submission.create({
      data,
    });

    const newVillageData = await this.prisma.villageData.update({
      where: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        spdpVillageId: data.spdpVillageId,
      },
      data: {
        surveySubmitted: { increment: 1 },
      },
    });
    console.log({ newVillageData });

    return submission;
  }

  async getAllSubmissions(): Promise<any[]> {
    return this.prisma.submission.findMany({
      // include: {
      //   submitter: {},
      // },
    });
  }

  async getSubmissionByVillageId(id: number): Promise<any> {
    const _id = Number(id);

    return this.prisma.submission.findMany({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      where: { spdpVillageId: _id },
    });
  }

  async getSubmissionByCitizenId(id: string): Promise<any> {
    return this.prisma.submission.findMany({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      where: { citizenId: id },
    });
  }

  async updateSubmission(
    id: number,
    data: Prisma.SubmissionUpdateInput,
  ): Promise<any> {
    return this.prisma.submission.update({
      where: { id },
      data,
    });
  }

  async deleteSubmission(id: number): Promise<any> {
    return this.prisma.submission.delete({
      where: { id },
    });
  }
}
