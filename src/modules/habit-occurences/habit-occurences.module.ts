import { Module } from '@nestjs/common';
import { HabitOccurencesService } from './service/habit-occurences.service';
import { HabitOccurencesController } from './controller/habit-occurences.controller';
import { HabitOccurence } from "../../typeorm/entities/HabitOccurence";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([HabitOccurence])],
  providers: [HabitOccurencesService],
  controllers: [HabitOccurencesController],
})
export class HabitOccurencesModule {}
