import { Module } from '@nestjs/common';

import { SubmissionController } from './submission.controller';
import { SubmissionService } from './submission.service';
import { TemporalModule } from 'nestjs-temporal';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    TemporalModule.registerWorker({
      workerOptions: {
        taskQueue: 'default',
        workflowsPath: require.resolve(
          '../temporal-workflows/submission/submission-workflow',
        ),
      },
    }),

    TemporalModule.registerClient(),
  ],
  controllers: [SubmissionController],
  providers: [SubmissionService, PrismaService],
})
export class SubmissionModule {}
