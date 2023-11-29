import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { map } from 'lodash';

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

  async getVillages(
    page: number,
    pageSize: number,
    stateCode: number,
    districtCode: number,
    blockCode: number,
  ) {
    const searchQuery = {
      stateCode: stateCode,
      districtCode: districtCode,
      blockCode: blockCode,
    };
    const skip = (page - 1) * pageSize;
    const villages = await this.prisma.villageData.findMany({
      where: searchQuery,
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

  async getGps(
    page: number,
    pageSize: number,
    gpCode: number,
    gpName: string,
  ): Promise<any> {
    const searchQuery = {
      gpCode: gpCode,
      gpName: {
        contains: gpName,
      },
    };
    const skip = (page - 1) * pageSize;

    const gps = await this.prisma.villageData.groupBy({
      where: searchQuery,
      by: ['gpCode', 'gpName'],
      skip,
      take: pageSize,
      _count: {
        gpCode: true,
      },
      orderBy: {
        gpCode: 'asc', // or 'desc' for descending order
      },
    });

    const totalCount = await this.prisma.villageData.groupBy({
      where: searchQuery,
      by: ['gpCode'],
    });
    return {
      result: {
        villages: gps,
        totalCount: totalCount?.length,
        currentPage: page,
        totalPages: Math.ceil(totalCount?.length / pageSize),
      },
    };
  }

  async getVillageByGpId(
    gpCode: number,
    stateCode,
    districtCode,
    blockCode,
  ): Promise<any> {
    const searchQuery = {
      gpCode: gpCode,
      stateCode: stateCode,
      districtCode: districtCode,
      blockCode: blockCode,
    };
    const villageData = await this.prisma.villageData.findMany({
      where: searchQuery,
    });
    return await Promise.all(
      map(villageData, async (record) => {
        record.surveySubmitted = await this.prisma.submission.count({
          where: { spdpVillageId: record.spdpVillageId },
        });
        return record;
      }),
    );
  }

  async test(): Promise<any> {
    return this.prisma.villageData.groupBy({
      by: ['gpCode', 'gpName'],
    });
  }
}
