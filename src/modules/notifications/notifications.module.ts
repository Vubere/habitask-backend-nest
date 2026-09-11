import { Module } from '@nestjs/common';
import { NotificationsService } from './service/notifications.service';
import { NotificationsController } from './controller/notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../../typeorm/entities/Notification';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
