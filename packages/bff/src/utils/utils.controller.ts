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
  ): Promise<any | null> {
    const validatedLimit = Number(limit) || 10;
    const validatedPage = Number(page) || 1;
    return this.utilService.getVillages(validatedPage, validatedLimit);
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
}
