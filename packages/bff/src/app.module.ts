import { Module } from '@nestjs/common';
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
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { MinioModule } from './minio/minio.module';
import { UploadService } from './upload/upload.service';
import { MinioService } from './minio/minio.service';
import { UploadController } from './upload/upload.controller';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration service available globally
      envFilePath: '.env', // Specify the path to your environment file if needed
    }),
    PrismaModule,
    // EnumeratorModule,
    //ScheduleModule,
    UtilsModule,
    EventEmitterModule.forRoot({
      maxListeners: 50,
      verboseMemoryLeak: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'your-secret-key', // Change this to your secret key
      signOptions: { expiresIn: '15d' }, // Adjust token expiration as needed
    }),
    SubmissionModule,
    MinioModule,
  ],
  controllers: [AppController, SubmissionController, UploadController],
  providers: [
    AppService,
    PrismaService,
    MinioService,
    SubmissionService,
    //  ScheduleService,
    CustomLogger,
    UploadService,
  ],
})
export class AppModule {}
