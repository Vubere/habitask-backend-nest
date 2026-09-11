import { Module } from '@nestjs/common';
import { TaskStepsService } from './service/task-steps.service';
import { TaskStepsController } from './controller/task-steps.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskStep } from '../../typeorm/entities/TaskStep';

@Module({
  imports: [TypeOrmModule.forFeature([TaskStep])],
  providers: [TaskStepsService],
  controllers: [TaskStepsController],
})
export class TaskStepsModule {}
