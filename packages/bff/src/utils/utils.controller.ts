import { Controller, Get, Post, Query, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { villageRecords } from './village-data';
@Controller('utils')
export class UtilsController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('villageData')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getVillageData(@Query() limit): Promise<any | null> {
    return this.prismaService.villageData.findMany({
      //skip: 3,
      take: 1000,
    });
  }

  @Get('/villageData/:id')
  async getSubmissionByCitizenId(@Param('id') id: number): Promise<any> {
    return this.prismaService.villageData.findFirst({
      where: {
        spdpVillageId: Number(id),
      },
    });
  }

  @Post('csv')
  async uploadVillageData(): Promise<any | null> {
    return await this.prismaService.villageData.createMany({
      data: villageRecords,
    });
  }
}
