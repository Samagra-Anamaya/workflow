// user.service.ts (or user.controller.ts)
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class EnumeratorService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<any> {
    const enumerator = await this.prisma.user.create({
      data,
    });
    return { result: { enumerator } };
  }
}
