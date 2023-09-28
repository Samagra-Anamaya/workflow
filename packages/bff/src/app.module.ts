import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubmissionController } from './submission/submission.controller';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { EnumeratorModule } from './enumerator/enumerator.module';
import { SubmissionService } from './submission/submission.service';
import { ScheduleModule } from './schedule/schedule.module';
import { UtilsModule } from './utils/utils.module';
import { ScheduleService } from './schedule/schedule.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/auth.strategy';

@Module({
  imports: [
    PrismaModule,
    EnumeratorModule,
    ScheduleModule,
    UtilsModule,
    AuthModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'your-secret-key', // Change this to your secret key
      signOptions: { expiresIn: '1h' }, // Adjust token expiration as needed
    }),
  ],
  controllers: [AppController, SubmissionController],
  providers: [
    AppService,
    PrismaService,
    SubmissionService,
    ScheduleService,
    AuthService,
    JwtStrategy,
  ],
})
export class AppModule {}
