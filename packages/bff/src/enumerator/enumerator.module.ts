import { Module } from '@nestjs/common';
import { EnumeratorController } from './enumerator.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnumeratorService } from './enumerator.service';

@Module({
  providers: [PrismaService, EnumeratorService],
  controllers: [EnumeratorController],
})
export class EnumeratorModule {}
