import { Module } from '@nestjs/common';
import { TasksService } from './controller/tasks.service';
import { TasksController } from './controller/tasks.controller';
import { TasksController } from './service/tasks.controller';
import { TasksService } from './service/tasks.service';

@Module({
  providers: [TasksService],
  controllers: [TasksController]
})
export class TasksModule {}
