import { Module } from '@nestjs/common';
import { RemindersController } from './controller/reminders.controller';
import { RemindersService } from './service/reminders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reminder } from '../../typeorm/entities/Reminder';

@Module({
  imports: [TypeOrmModule.forFeature([Reminder])],
  controllers: [RemindersController],
  providers: [RemindersService],
})
export class RemindersModule {}
