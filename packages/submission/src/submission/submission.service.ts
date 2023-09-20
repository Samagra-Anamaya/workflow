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
    const submission = await this.prisma.submission.create({
      data,
    });
    return submission;
  }

  async getAllSubmissions(): Promise<Submission[]> {
    return this.prisma.submission.findMany();
  }

  async getSubmissionById(id: number): Promise<Submission | null> {
    return this.prisma.submission.findUnique({
      where: { id },
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
