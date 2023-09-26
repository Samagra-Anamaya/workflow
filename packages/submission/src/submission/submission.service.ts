// submission.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Submission, Prisma } from '@prisma/client';

@Injectable()
export class SubmissionService {
  constructor(private prisma: PrismaService) {}

  async createSubmission(
    data: Prisma.SubmissionCreateInput,
  ): Promise<Submission> {
    const _data = {
      ...data,
      // submitter: {
      //   connect: { id: data.submitter },
      // },
    };

    const submission = await this.prisma.submission.create({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      data: _data,
    });
    return submission;
  }

  async getAllSubmissions(): Promise<Submission[]> {
    return this.prisma.submission.findMany({
      include: {
        submitter: {},
      },
    });
  }

  async getSubmissionById(id: number): Promise<Submission | null> {
    const _id = Number(id);
    return this.prisma.submission.findUnique({
      where: { id: _id },
      include: {
        submitter: {},
      },
    });
  }

  async updateSubmission(
    id: number,
    data: Prisma.SubmissionUpdateInput,
  ): Promise<Submission | null> {
    return this.prisma.submission.update({
      where: { id },
      data,
    });
  }

  async deleteSubmission(id: number): Promise<Submission | null> {
    return this.prisma.submission.delete({
      where: { id },
    });
  }
}
