import { Test, TestingModule } from '@nestjs/testing';
import { EnumeratorController } from './enumerator.controller';

describe('EnumeratorController', () => {
  let controller: EnumeratorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnumeratorController],
    }).compile();

    controller = module.get<EnumeratorController>(EnumeratorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
