import { Test, TestingModule } from '@nestjs/testing';
import { HabitActionsService } from './habit-actions.service';

describe('HabitActionsService', () => {
  let service: HabitActionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HabitActionsService],
    }).compile();

    service = module.get<HabitActionsService>(HabitActionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
