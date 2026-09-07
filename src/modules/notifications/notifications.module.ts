import { Module } from '@nestjs/common';
import { NotificationsService } from './service/notifications.service';
import { NotificationsController } from './controller/notifications.controller';

@Module({
  providers: [NotificationsService],
  controllers: [NotificationsController]
})
export class NotificationsModule {}
