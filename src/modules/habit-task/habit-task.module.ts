import { Module } from '@nestjs/common';
import { HabitTaskService } from './service/habit-task.service';
import { HabitTaskController } from './controller/habit-task.controller';

@Module({
  providers: [HabitTaskService],
  controllers: [HabitTaskController]
})
export class HabitTaskModule {}
