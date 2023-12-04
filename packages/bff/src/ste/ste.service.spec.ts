import { Test, TestingModule } from '@nestjs/testing';
import { SteService } from './ste.service';

describe('SteService', () => {
  let service: SteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SteService],
    }).compile();

    service = module.get<SteService>(SteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
