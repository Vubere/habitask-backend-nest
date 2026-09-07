import { Module } from '@nestjs/common';
import { HabitActionsController } from './controller/habit-actions.controller';
import { HabitActionsService } from './service/habit-actions.service';

@Module({
  controllers: [HabitActionsController],
  providers: [HabitActionsService]
})
export class HabitActionsModule {}
