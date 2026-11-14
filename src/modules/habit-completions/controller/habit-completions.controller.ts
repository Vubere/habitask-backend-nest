import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { HabitCompletionsService } from '../service/habit-completions.service';
import {
  CreateHabitCompletionDto,
  QueryHabitCompletionDto,
  UpdateHabitCompletionDto,
} from '../dtos/HabitCompletion.dto';
import { PaginationAndSortDto } from '../../general/dtos/pagination_and_sort_dto';
import { CurrentUser } from '../../users/decorators/user.decorator';
import type { AuthInfo } from '../../users/types';

@Controller('habit-completions')
export class HabitCompletionsController {
  constructor(private readonly completionsService: HabitCompletionsService) {}

  @Get()
  async getCompletions(
    @CurrentUser() authInfo: AuthInfo,
    @Query() query: QueryHabitCompletionDto,
    @Query() pagination: PaginationAndSortDto,
    @Res() response: Response,
  ) {
    if (authInfo.role !== 'admin') {
      query.user_id = authInfo.user_id;
    }
    try {
      const completions = await this.completionsService.findCompletions(
        query,
        pagination,
      );
      return response.status(200).json({
        data: completions,
        pagination,
        success: true,
        message: 'habit completions retrieved successfully',
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || 'failed to process request',
        success: false,
      });
    }
  }

  @Get('summary')
  async getCompletionSummary(
    @CurrentUser() authInfo: AuthInfo,
    @Query() query: QueryHabitCompletionDto,
    @Query() pagination: PaginationAndSortDto,
    @Res() response: Response,
  ) {
    if (authInfo.role !== 'admin') {
      query.user_id = authInfo.user_id;
    }
    try {
      const summaries = await this.completionsService.getCompletionSummary(
        query,
        pagination,
      );
      return response.status(200).json({
        data: summaries,
        pagination,
        success: true,
        message: 'habit completion summaries retrieved successfully',
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || 'failed to process request',
        success: false,
      });
    }
  }

  @Get(':id')
  async getCompletionById(@Param('id') id: string, @Res() response: Response) {
    try {
      const completion = await this.completionsService.findCompletion(id);
      return response.status(200).json({
        data: completion,
        success: true,
        message: 'habit completion retrieved successfully',
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || 'failed to process request',
        success: false,
      });
    }
  }

  @Post()
  async createCompletion(
    @CurrentUser() authInfo: AuthInfo,
    @Body() completion: CreateHabitCompletionDto,
    @Res() response: Response,
  ) {
    try {
      await this.completionsService.createCompletion({
        ...completion,
        user_id: authInfo.user_id,
      });
      return response.status(201).json({
        message: 'habit completion created successfully',
        success: true,
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || 'failed to process request',
        success: false,
      });
    }
  }

  @Put(':id')
  async updateCompletion(
    @Param('id') id: string,
    @Body() completion: UpdateHabitCompletionDto,
    @Res() response: Response,
  ) {
    try {
      const updated = await this.completionsService.updateCompletion(id, completion);
      return response.status(200).json({
        message: 'habit completion updated successfully',
        success: true,
        data: updated,
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || 'failed to process request',
        success: false,
      });
    }
  }

  @Delete(':id')
  async deleteCompletion(@Param('id') id: string, @Res() response: Response) {
    try {
      await this.completionsService.deleteCompletion(id);
      return response.status(200).json({
        message: 'habit completion deleted successfully',
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
