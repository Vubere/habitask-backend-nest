import { Module } from '@nestjs/common';
import { HabitOccurencesService } from './service/habit-occurences.service';
import { HabitOccurencesController } from './controller/habit-occurences.controller';

@Module({
  providers: [HabitOccurencesService],
  controllers: [HabitOccurencesController]
})
export class HabitOccurencesModule {}
