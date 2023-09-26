import { Module } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { UtilsController } from './utils.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [UtilsService, PrismaService],
  controllers: [UtilsController],
})
export class UtilsModule {}
