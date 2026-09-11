import { Module } from '@nestjs/common';
import { HabitActionsController } from './controller/habit-actions.controller';
import { HabitActionsService } from './service/habit-actions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitAction } from '../../typeorm/entities/HabitAction';

@Module({
  imports: [TypeOrmModule.forFeature([HabitAction])],
  controllers: [HabitActionsController],
  providers: [HabitActionsService],
})
export class HabitActionsModule {}
