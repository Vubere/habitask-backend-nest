import { Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { NotificationsService } from '../service/notifications.service';
import { CurrentUser } from '../../users/decorators/user.decorator';
import type { AuthInfo } from '../../users/types';
import type { Response } from 'express';
import { QueryNotificationDto } from '../dto/QueryNotification.dto';
import { PaginationAndSortDto } from '../../general/dtos/pagination_and_sort_dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(
    @CurrentUser() authInfo: AuthInfo,
    @Query() query: QueryNotificationDto,
    @Query() pagination: PaginationAndSortDto,
    @Res() response: Response,
  ) {
    if (authInfo.role !== 'admin') {
      query.user_id = authInfo.user_id;
    }
    try {
      const notifications = await this.notificationsService.findNotifications(
        query,
        pagination,
      );
      return response.status(200).json({
        data: notifications,
        pagination: pagination,
        success: true,
        message: 'notifications retrieved successfully',
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || 'failed to process request',
        success: false,
      });
    }
  }

  @Get(':id')
  async getNotificationById(
    @Param('id') id: string,
    @CurrentUser() authInfo: AuthInfo,
    @Res() response: Response,
  ) {
    try {
      const notification = await this.notificationsService.findNotification(id);
      return response.status(200).json({
        data: notification,
        success: true,
        message: 'notification retrieved successfully',
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || 'failed to process request',
        success: false,
      });
    }
  }

  @Get('summary')
  async getNotificationSummary(
    @CurrentUser() authInfo: AuthInfo,
    @Query() query: QueryNotificationDto,
    @Query() pagination: PaginationAndSortDto,
    @Res() response: Response,
  ) {
    if (authInfo.role !== 'admin') {
      query.user_id = authInfo.user_id;
    }
    try {
      const notificationSummaries =
        await this.notificationsService.getNotificationSummary(
          query,
          pagination,
        );
      return response.status(200).json({
        data: notificationSummaries,
        pagination: pagination,
        success: true,
        message: 'notification summaries retrieved successfully',
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || 'failed to process request',
        success: false,
      });
    }
  }

  @Post('mark-as-read/:id')
  async markNotificationAsRead(
    @CurrentUser() authInfo: AuthInfo,
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    try {
      await this.notificationsService.markAsRead(id);
      return response.status(200).json({
        message: 'notification marked as read successfully',
        success: true,
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || 'failed to process request',
        success: false,
      });
    }
  }
  @Post('mark-all-as-read')
  async markAllNotificationsAsRead(
    @CurrentUser() authInfo: AuthInfo,
    @Res() response: Response,
  ) {
    try {
      await this.notificationsService.markAllAsRead(authInfo.user_id);
      return response.status(200).json({
        message: 'all notifications marked as read successfully',
        success: true,
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || 'failed to process request',
        success: false,
      });
    }
  }
}
