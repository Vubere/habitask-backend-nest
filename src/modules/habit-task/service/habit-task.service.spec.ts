import { Test, TestingModule } from '@nestjs/testing';
import { HabitTaskService } from './habit-task.service';

describe('HabitTaskService', () => {
  let service: HabitTaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HabitTaskService],
    }).compile();

    service = module.get<HabitTaskService>(HabitTaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
