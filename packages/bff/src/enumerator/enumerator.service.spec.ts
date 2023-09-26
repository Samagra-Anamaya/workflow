import { Test, TestingModule } from '@nestjs/testing';
import { EnumeratorService } from './enumerator.service';

describe('EnumeratorService', () => {
  let service: EnumeratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnumeratorService],
    }).compile();

    service = module.get<EnumeratorService>(EnumeratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
