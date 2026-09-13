import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res } from '@nestjs/common';
import { HabitActionsService } from "../service/habit-actions.service";
import { CurrentUser } from "../../users/decorators/user.decorator";
import type { AuthInfo } from "../../users/types";
import { PaginationAndSortDto } from "../../general/dtos/pagination_and_sort_dto";
import type { Response } from "express";
import { FindHabitActionDto } from "../dtos/FindHabitAction.dto";
import { UpdateHabitActionDto } from "../dtos/UpdateHabitAction.dto";
import { CreateHabitActionDto } from "../dtos/CreateHabitAction.dto";
import { HabitActionCreateType } from "../types";

@Controller('habit-actions')
export class HabitActionsController {
  constructor(private readonly habitActionsService: HabitActionsService) {}
  @Get()
  async getHabitActions(
    @CurrentUser() authInfo: AuthInfo,
    @Query() query: FindHabitActionDto,
    @Query() pagination: PaginationAndSortDto,
    @Res() response: Response,
  ) {
    if (authInfo.role !== "admin") {
      query.user_id = authInfo.user_id;
    }
    try {
      const habitActions = await this.habitActionsService.findHabitActions(
        query,
        pagination,
      );
      return response.status(200).json({
        "data": habitActions,
        "pagination": pagination,
        "success": true,
        "message": "habit actions retrieved successfully",
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || "failed to process request",
        success: false,
      });
    }
  }
  @Get(':id')
  async getHabitActionById(
    @CurrentUser() authInfo: AuthInfo,
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    try {
      if (authInfo.role !== "admin") {
        id = authInfo.user_id;
      }
      const habitAction = await this.habitActionsService.findHabitAction(id);
      return response.status(200).json({
        data: habitAction,
        success: true,
        message: "habit action retrieved successfully",
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || "failed to process request",
        success: false
      });
    }
  }
  @Get('summary')
  async getHabitActionSummary(
    @CurrentUser() authInfo: AuthInfo,
    @Query() query: FindHabitActionDto,
    @Query() pagination: PaginationAndSortDto,
    @Res() response: Response,
  ) {
    if (authInfo.role !== "admin") {
      query.user_id = authInfo.user_id;
    }
    try {
      const habitActionSummaries = await this.habitActionsService.getHabitActionSummary(
        query,
        pagination
      );
      return response.status(200).json({
        "data": habitActionSummaries,
        "pagination": pagination,
        "success": true,
        "message": "habit action summaries retrieved successfully",
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || "failed to process request",
        success: false,
      });
    }
  }
  @Post()
  async createHabitAction(
    @CurrentUser() authInfo: AuthInfo,
    @Body() habitAction: CreateHabitActionDto,
    @Res() response: Response,
  ) {
    try {
      const habitActionPayload: HabitActionCreateType = {
        ...habitAction,
        user_id: authInfo.user_id,
        is_positive: !!habitAction.is_positive,
      };
      await this.habitActionsService.createHabitAction(
        habitActionPayload,
      );
      return response.status(201).json({
        message: "habit action created successfully",
        success: true,
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || "failed to process request",
        success: false,
      });
    }
  }

  @Put(':id')
  async updateHabitAction(
    @Param('id') id: string,
    @Body() habitAction: UpdateHabitActionDto,
    @Res() response: Response,
  ) {
    try {
      const updatedHabitAction = await this.habitActionsService.updateHabitAction(
        id,
        habitAction,
      );
      return response.status(200).json({
        message: "habit action updated successfully",
        success: true,
        data: updatedHabitAction,
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || "failed to process request",
        success: false,
      });
    }
  }
  @Delete(':id')
  async deleteHabitAction(
    @CurrentUser() authInfo: AuthInfo,
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    try {
      await this.habitActionsService.deleteHabitAction(id);
      return response.status(200).json({
        message: "habit action deleted successfully",
        success: true,
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || "failed to process request",
        success: false,
      });
    }
  }
}
