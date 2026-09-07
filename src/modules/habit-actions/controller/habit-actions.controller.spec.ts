import { Test, TestingModule } from '@nestjs/testing';
import { HabitActionsController } from './habit-actions.controller';

describe('HabitActionsController', () => {
  let controller: HabitActionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HabitActionsController],
    }).compile();

    controller = module.get<HabitActionsController>(HabitActionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
