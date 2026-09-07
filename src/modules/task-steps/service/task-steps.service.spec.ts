import { Test, TestingModule } from '@nestjs/testing';
import { TaskStepsService } from './task-steps.service';

describe('TaskStepsService', () => {
  let service: TaskStepsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskStepsService],
    }).compile();

    service = module.get<TaskStepsService>(TaskStepsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
