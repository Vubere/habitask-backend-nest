import { Test, TestingModule } from '@nestjs/testing';
import { TaskStepsController } from './task-steps.controller';

describe('TaskStepsController', () => {
  let controller: TaskStepsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskStepsController],
    }).compile();

    controller = module.get<TaskStepsController>(TaskStepsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
