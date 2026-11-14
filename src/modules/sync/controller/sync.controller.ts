import { Controller, Get, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { SyncService } from '../service/sync.service';
import { CurrentUser } from '../../users/decorators/user.decorator';
import type { AuthInfo } from '../../users/types';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Get()
  async getChanges(
    @CurrentUser() authInfo: AuthInfo,
    @Query('since') since: string | undefined,
    @Res() res: Response,
  ) {
    try {
      const data = await this.syncService.getChanges(authInfo.user_id, since);
      res.status(200).json({
        data,
        success: true,
        message: 'changes retrieved successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as any)?.message || 'failed to process request',
      });
    }
  }
}
