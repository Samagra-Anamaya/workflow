import { Test, TestingModule } from '@nestjs/testing';
import { SteController } from './ste.controller';

describe('SteController', () => {
  let controller: SteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SteController],
    }).compile();

    controller = module.get<SteController>(SteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
