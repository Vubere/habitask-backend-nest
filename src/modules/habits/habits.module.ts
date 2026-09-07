import { Module } from '@nestjs/common';
import { HabitsController } from './controller/habits.controller';
import { HabitsService } from './service/habits.service';

@Module({
  controllers: [HabitsController],
  providers: [HabitsService]
})
export class HabitsModule {}
