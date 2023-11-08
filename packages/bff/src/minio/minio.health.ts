// minio.health.ts
import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { MinioService } from './minio.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioHealthIndicator extends HealthIndicator {
  constructor(
    private minioService: MinioService,
    private configService: ConfigService,
  ) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const isHealthy = await this.minioService.minioClient.bucketExists(
      this.configService.get<string>('MINIO_BUCKET'),
    );
    const result = this.getStatus(key, isHealthy, { isHealthy: isHealthy });

    if (isHealthy) {
      return result;
    }

    throw new HealthCheckError('MinioHealthIndicator failed', result);
  }
}
