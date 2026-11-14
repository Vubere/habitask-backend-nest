import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitCompletion } from '../../typeorm/entities/HabitCompletion';
import { Habit } from '../../typeorm/entities/Habit';
import { HabitCompletionsController } from './controller/habit-completions.controller';
import { HabitCompletionsService } from './service/habit-completions.service';

@Module({
  imports: [TypeOrmModule.forFeature([HabitCompletion, Habit])],
  controllers: [HabitCompletionsController],
  providers: [HabitCompletionsService],
  exports: [HabitCompletionsService],
})
export class HabitCompletionsModule {}
