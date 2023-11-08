import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
  HttpHealthIndicator,
} from '@nestjs/terminus';
import { MinioService } from 'src/minio/minio.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class HealthService extends HealthIndicator {
  constructor(
    private minioService: MinioService,
    private prismaService: PrismaService,
    private httpIndicator: HttpHealthIndicator,
    private configService: ConfigService,
  ) {
    super();
  }

  async isMinioHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const isHealthy = await this.minioService.minioClient.bucketExists(
        this.configService.get<string>('MINIO_BUCKET'),
      );
      return this.getStatus(key, isHealthy, { isHealthy });
    } catch (error) {
      const result = this.getStatus(key, false, { error: error.message });
      throw new HealthCheckError('MinioHealthIndicator failed', result);
    }
  }

  async isPrismaHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.prismaService.$queryRaw`SELECT 1`;
      return this.getStatus(key, true, {});
    } catch (error) {
      const result = this.getStatus(key, false, { error: error.message });
      throw new HealthCheckError('PrismaHealthIndicator failed', result);
    }
  }

  async isUserServiceHealthy(key: string): Promise<HealthIndicatorResult> {
    console.log({ key });
    const url = `${this.configService.get<string>('USER_SERVICE')}/health`;
    try {
      const rr = await this.httpIndicator.pingCheck(key, url, {
        timeout: 3000,
      });
      console.log({ rr });
      return rr;
    } catch (error) {
      const result = this.getStatus(key, false, {
        error: `Failed to ping ${url}: ${error.message}`,
      });
      throw new HealthCheckError(`${key} health check failed`, result);
    }
  }
}
