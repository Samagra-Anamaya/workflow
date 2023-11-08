// health.controller.ts
import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private servicesIndicator: HealthService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.servicesIndicator.isMinioHealthy('minio'),
      () => this.servicesIndicator.isPrismaHealthy('prisma'),
      () => this.servicesIndicator.isUserServiceHealthy('user-service'),
    ]);
  }
}
