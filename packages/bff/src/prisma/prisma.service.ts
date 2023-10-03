import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomLogger } from 'src/common/logger';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  private readonly logger = new CustomLogger('DBService');
  async onModuleInit() {
    this.logger.verbose('Initialized and Connected 🎉');
    await this.$connect();
  }

  async onModuleDestroy() {
    this.logger.error('Disconnecting DB');
    await this.$disconnect();
  }
}
