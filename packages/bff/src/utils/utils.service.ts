import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UtilsService {
  constructor(private prisma: PrismaService) {}

  async getVillageById(id: number): Promise<any> {
    const villages = await this.prisma.villageData.findFirst({
      where: {
        spdpVillageId: Number(id),
      },
    });

    return {
      result: villages,
    };
  }

  async addVillage(data: any): Promise<any> {
    const newVillage = await this.prisma.villageData.create({
      data,
    });

    return {
      result: newVillage,
    };
  }

  async getVillages(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    const villages = await this.prisma.villageData.findMany({
      skip,
      take: pageSize,
      orderBy: { spdpVillageId: 'asc' }, // Change to 'desc' for ascending order
    });

    const totalCount = await this.prisma.villageData.count();

    return {
      result: {
        villages,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    };
  }

  async deleteAllVillage(): Promise<any> {
    return this.prisma.villageData.deleteMany({});
  }
}
