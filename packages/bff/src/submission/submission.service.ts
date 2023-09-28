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

    const villageData = await this.prisma.villageData.update({
      where: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        spdpVillageId: data.spdpVillageId,
      },
      data: {
        surveySubmitted: { increment: 1 },
      },
    });

    return { result: { submission, villageData } };
  }

  async getSubmissions(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const submissions = await this.prisma.submission.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' }, // Change to 'asc' for ascending order
    });

    const totalCount = await this.prisma.submission.count();

    return {
      result: {
        submissions,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };
  }

  async getSubmissionByVillageId(
    id: number,
    page: number,
    pageSize: number,
  ): Promise<any> {
    const _id = Number(id);
    const skip = (page - 1) * pageSize;
    const submissions = await this.prisma.submission.findMany({
      where: { spdpVillageId: _id },
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' }, // Change to 'asc' for ascending order
    });

    const totalCount = await this.prisma.submission.count();

    return {
      result: {
        submissions,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };
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
    const updateSubmission = await this.prisma.submission.update({
      where: { id },
      data,
    });

    return { result: { updateSubmission } };
  }

  async deleteSubmission(id: number): Promise<any> {
    return this.prisma.submission.delete({
      where: { id },
    });
  }
}
