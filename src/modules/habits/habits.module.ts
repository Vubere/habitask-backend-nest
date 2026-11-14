import { Module } from '@nestjs/common';
import { HabitsController } from './controller/habits.controller';
import { HabitsService } from './service/habits.service';
import { Habit } from '../../typeorm/entities/Habit';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitCompletionsModule } from '../habit-completions/habit-completions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Habit]), HabitCompletionsModule],
  controllers: [HabitsController],
  providers: [HabitsService],
})
export class HabitsModule {}
