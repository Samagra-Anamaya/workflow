import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CustomLogger } from 'src/common/logger';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  private readonly logger = new CustomLogger('DBService');
  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.verbose('Initialized and Connected 🎉');
    } catch (error) {
      console.log({ error: error.message });
      this.logger.error('Warning: Database connection not established.');
    }
  }

  async onModuleDestroy() {
    this.logger.error('Disconnecting DB');
    await this.$disconnect();
  }
}
