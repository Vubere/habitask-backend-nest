import { Module } from '@nestjs/common';
import { SyncController } from './controller/sync.controller';
import { SyncService } from './service/sync.service';

@Module({
  controllers: [SyncController],
  providers: [SyncService],
})
export class SyncModule {}
