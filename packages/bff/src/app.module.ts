import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubmissionController } from './submission/submission.controller';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
//import { EnumeratorModule } from './enumerator/enumerator.module';
import { SubmissionService } from './submission/submission.service';
// import { ScheduleModule } from './schedule/schedule.module';
import { UtilsModule } from './utils/utils.module';
//import { ScheduleService } from './schedule/schedule.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CustomLogger } from './common/logger';
import { SubmissionModule } from './submission/submission.module';
import { ConfigModule } from '@nestjs/config';
import { MinioModule } from './minio/minio.module';
import { UploadService } from './upload/upload.service';
import { MinioService } from './minio/minio.service';
import { UploadController } from './upload/upload.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { HttpHealthIndicator, TerminusModule } from '@nestjs/terminus';
import { MinioHealthIndicator } from './minio/minio.health';
import { HealthController } from './health/health.controller';
import { HealthService } from './health/health.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration service available globally
      envFilePath: '.env', // Specify the path to your environment file if needed
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    PrismaModule,
    TerminusModule,
    HttpModule,
    // EnumeratorModule,
    //ScheduleModule,
    UtilsModule,
    // EventEmitterModule.forRoot({
    //   maxListeners: 50,
    //   verboseMemoryLeak: true,
    // }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'your-secret-key', // Change this to your secret key
      signOptions: { expiresIn: '15d' }, // Adjust token expiration as needed
    }),
    SubmissionModule,
    MinioModule,
  ],
  controllers: [
    AppController,
    SubmissionController,
    UploadController,
    HealthController,
  ],
  providers: [
    {
      provide: 'TERMINUS_LOGGER',
      useClass: Logger,
    },
    AppService,
    HttpHealthIndicator,
    PrismaService,
    MinioService,
    SubmissionService,
    //  ScheduleService,
    CustomLogger,
    UploadService,
    MinioHealthIndicator,
    HealthService,
  ],
})
export class AppModule {}
