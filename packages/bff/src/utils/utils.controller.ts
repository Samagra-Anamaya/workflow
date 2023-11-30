import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  Body,
  Delete,
} from '@nestjs/common';

import { UtilsService } from './utils.service';
import { CreateVillageDto } from './dto/util.dto';
@Controller('utils')
export class UtilsController {
  constructor(private readonly utilService: UtilsService) {}

  @Get('villageData')
  async getVillageData(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('stateCode') stateCode: number,
    @Query('districtCode') districtCode: number,
    @Query('blockCode') blockCode: number,
  ): Promise<any | null> {
    const validatedLimit = Number(limit) || 10;
    const validatedPage = Number(page) || 1;
    stateCode = Number(stateCode) || undefined;
    districtCode = Number(districtCode) || undefined;
    blockCode = Number(blockCode) || undefined;
    return this.utilService.getVillages(
      validatedPage,
      validatedLimit,
      stateCode,
      districtCode,
      blockCode,
    );
  }

  @Get('/villageData/:id')
  async getVillageById(@Param('id') id: number): Promise<any> {
    return this.utilService.getVillageById(id);
  }

  @Post('/addVillage')
  async addVillage(@Body() data: CreateVillageDto): Promise<any> {
    return this.utilService.addVillage(data);
  }

  @Delete('/villages/deleteAll')
  async clearVillageData(): Promise<any> {
    return this.utilService.deleteAllVillage();
  }

  @Get('villages/getGps')
  async getGps(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('gpCode') gpCode: number,
    @Query('gpName') gpName: string,
  ): Promise<any> {
    const validatedLimit = Number(limit) || 10;
    const validatedPage = Number(page) || 1;
    gpCode = Number(gpCode) || undefined;
    return this.utilService.getGps(
      validatedPage,
      validatedLimit,
      gpCode,
      gpName,
    );
  }

  @Get('/villages/gp/:id')
  async getVillageByGpId(
    @Param('id') id: number,
    @Query('stateCode') stateCode: number,
    @Query('districtCode') districtCode: number,
    @Query('blockCode') blockCode: number,
  ): Promise<any> {
    const gpCode = Number(id);
    stateCode = Number(stateCode) || undefined;
    districtCode = Number(districtCode) || undefined;
    blockCode = Number(blockCode) || undefined;
    return this.utilService.getVillageByGpId(
      gpCode,
      stateCode,
      districtCode,
      blockCode,
    );
  }

  @Get('/test')
  async test(): Promise<any> {
    return this.utilService.test();
  }
}
