import { Test, TestingModule } from '@nestjs/testing';
import { HabitOccurencesService } from './habit-occurences.service';

describe('HabitOccurencesService', () => {
  let service: HabitOccurencesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HabitOccurencesService],
    }).compile();

    service = module.get<HabitOccurencesService>(HabitOccurencesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
