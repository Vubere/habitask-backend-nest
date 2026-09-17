import { Test, TestingModule } from '@nestjs/testing';
import { HabitTaskController } from './habit-task.controller';

describe('HabitTaskController', () => {
  let controller: HabitTaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HabitTaskController],
    }).compile();

    controller = module.get<HabitTaskController>(HabitTaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
