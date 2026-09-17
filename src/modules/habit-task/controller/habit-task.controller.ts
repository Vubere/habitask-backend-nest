import { Controller, Get, Query, Res } from '@nestjs/common';
import { HabitTaskService } from '../service/habit-task.service';
import { HabitTaskFilterDTO } from '../dtos/habit-task.dto';
import { PaginationAndSortDto } from '../../general/dtos/pagination_and_sort_dto';
import type { Response } from 'express';
import { CurrentUser } from '../../users/decorators/user.decorator';
import type { AuthInfo } from '../../users/types';

@Controller('habit-task')
export class HabitTaskController {
  constructor(private readonly habitTaskService: HabitTaskService) {}
  @Get()
  async getHabitTaskDisplayDetails(
    @CurrentUser() authInfo: AuthInfo,
    @Query() query: HabitTaskFilterDTO,
    @Query() pagination: PaginationAndSortDto,
    @Res() res: Response,
  ) {
    if (authInfo.role !== 'admin') {
      query.user_id = authInfo.user_id;
    }
    try {
      const data = await this.habitTaskService.getHabitTaskDisplayDetails(
        query,
        pagination,
      );
      res.status(200).json({
        data,
        pagination,
        success: true,
        message: 'habit tasks retrieved successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as any)?.message || 'failed to process request',
      });
    }
  }
}
