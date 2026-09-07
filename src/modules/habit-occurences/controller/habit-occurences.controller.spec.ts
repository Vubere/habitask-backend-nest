import { Test, TestingModule } from '@nestjs/testing';
import { HabitOccurencesController } from './habit-occurences.controller';

describe('HabitOccurencesController', () => {
  let controller: HabitOccurencesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HabitOccurencesController],
    }).compile();

    controller = module.get<HabitOccurencesController>(HabitOccurencesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
