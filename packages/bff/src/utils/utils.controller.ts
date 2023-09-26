import { Controller, Get, Post, Query } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { map, dropRight } from 'lodash';
import * as fs from 'fs';
const filePath = './data.csv';

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
  @Post('csv')
  async uploadCSV() {
    fs.readFile(filePath, 'utf8', async (err, data) => {
      dropRight(
        map(data.split('\n'), async (e) => {
          if (true) {
            const colArray = e.split(',');
            if (
              colArray[1]?.replaceAll('"', '') !== '' &&
              colArray[1]?.replaceAll('"', '')
            ) {
              const obj = {
                districtName: colArray[1]?.replaceAll('"', ''),
                tehsilName: colArray[2]?.replaceAll('"', ''),
                riCircleName: colArray[3]?.replaceAll('"', ''),
                villageName: colArray[4]?.replaceAll('"', ''),
                distLGDCode: colArray[5]?.replaceAll('"', ''),
                blockLGDCode: colArray[6]?.replaceAll('"', ''),
                gplgdCode: colArray[7]?.replaceAll('"', ''),
                villageLGDCode: colArray[8]?.replaceAll('"', ''),
                spdpVillageId: colArray[9]?.replaceAll('"', ''),
              };
              const rr = await this.prismaService.villageData.create({
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                data: obj,
              });
              console.log({ rr });
              return obj;
            } else return;
          }
        }),
        3,
      );
    });
  }
}
