import { Module } from '@nestjs/common';
import { TaskStepsService } from './service/task-steps.service';
import { TaskStepsController } from './controller/task-steps.controller';

@Module({
  providers: [TaskStepsService],
  controllers: [TaskStepsController]
})
export class TaskStepsModule {}
