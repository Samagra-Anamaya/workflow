import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  UseGuards,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UtilsService } from './utils.service';
@Controller('utils')
export class UtilsController {
  constructor(private readonly submissionService: UtilsService) {}

  @Get('secure')
  @UseGuards(JwtAuthGuard)
  getSecureData() {
    return `Hello! This is secure data.`;
  }

  @Get('villageData')
  async getVillageData(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<any | null> {
    return this.submissionService.getVillages(
      Number(page) || 1,
      Number(limit) || 10,
    );
  }

  @Get('/villageData/:id')
  async getVillageById(@Param('id') id: number): Promise<any> {
    return this.submissionService.getVillageById(id);
  }

  @Post('/addVillage')
  async addVillage(@Body() data: any): Promise<any> {
    return this.submissionService.addVillage(data);
  }

  // @Post('csv')
  // async uploadVillageData(): Promise<any | null> {
  //   return await this.prismaService.villageData.createMany({
  //     data: villageRecords,
  //   });
  // }
}
