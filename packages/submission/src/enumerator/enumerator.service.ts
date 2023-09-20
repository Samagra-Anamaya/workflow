// user.service.ts (or user.controller.ts)
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class EnumeratorService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async saveSubmissionIdInUser(
    userId: string,
    submissionId: number,
  ): Promise<User | null> {
    return this.prisma.user.update({
      where: { userId },
      data: {
        submissions: {
          connect: { id: submissionId },
        },
      },
    });
  }
}
