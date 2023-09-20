import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubmissionController } from './submission/submission.controller';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { EnumeratorModule } from './enumerator/enumerator.module';
import { SubmissionService } from './submission/submission.service';

@Module({
  imports: [PrismaModule, EnumeratorModule],
  controllers: [AppController, SubmissionController],
  providers: [AppService, PrismaService, SubmissionService],
})
export class AppModule {}
