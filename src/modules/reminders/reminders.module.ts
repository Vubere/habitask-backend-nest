import { Module } from '@nestjs/common';
import { RemindersController } from './controller/reminders.controller';
import { RemindersService } from './service/reminders.service';

@Module({
  controllers: [RemindersController],
  providers: [RemindersService]
})
export class RemindersModule {}
