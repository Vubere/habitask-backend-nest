import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res } from '@nestjs/common';
import { HabitsService } from "../service/habits.service";
import type { AuthInfo } from "../../users/types";
import { CurrentUser } from "../../users/decorators/user.decorator";
import { HabitQueryDto } from "../dtos/QueryHabit.dto";
import { PaginationAndSortDto } from "../../general/dtos/pagination_and_sort_dto";
import type { Response } from "express";
import { HabitUpdateDto } from "../dtos/UpdateHabit.dto.";
import { CreateHabitDto } from "../dtos/CreateHabit.dto";
import { HabitCreateType } from "../types";

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Get()
  async getHabits(
    @CurrentUser() authInfo: AuthInfo,
    @Query() query: HabitQueryDto,
    @Query() pagination: PaginationAndSortDto,
    @Res() response: Response,
  ){
    if (authInfo.role !== "admin") {
      query.user_id = authInfo.user_id;
    }
    try {
      const habits = await this.habitsService.findHabits(query, pagination);
      return response.status(200).json({
        "data": habits,
        "pagination": pagination,
        "success": true,
        "message": "habits retrieved successfully",
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || "failed to process request",
        success: false,
      });
    }
  }
  @Get(':id')
  async getHabitById(
    @CurrentUser() authInfo: AuthInfo,
    @Param('id') id: string,
    @Res() response: Response,
  ){
    try {
      if (authInfo.role !== "admin") {
        id = authInfo.user_id;
      }
      const habit = await this.habitsService.findHabit(id);
      return response.status(200).json({
        data: habit,
        success: true,
        message: "habit retrieved successfully",
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || "failed to process request",
        success: false
      });
    }
  }

  @Get('summary')
  async getHabitSummary(
    @CurrentUser() authInfo: AuthInfo,
    @Query() query: HabitQueryDto,
    @Query() pagination: PaginationAndSortDto,
    @Res() response: Response,
  ){
    if (authInfo.role !== "admin") {
      query.user_id = authInfo.user_id;
    }
    try {
      const habitSummaries = await this.habitsService.getHabitSummary(
        query,
        pagination
      );
      return response.status(200).json({
        "data": habitSummaries,
        "pagination": pagination,
        "success": true,
        "message": "habit summaries retrieved successfully",
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || "failed to process request",
        success: false,
      });
    }
  }

  @Post()
  async createHabit(
    @CurrentUser() authInfo: AuthInfo,
    @Body() habit: CreateHabitDto,
    @Res() response: Response,
  ){
    try {
      const habitPayload: HabitCreateType = {
        ...habit,
        user_id: authInfo.user_id,
        is_positive: !!habit.is_positive,
      };
      await this.habitsService.createHabit(
        habitPayload,
      );
      return response.status(201).json({
        message: "habit created successfully",
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
  async updateHabit(
    @CurrentUser() authInfo: AuthInfo,
    @Param('id') id: string,
    @Body() habit: HabitUpdateDto,
    @Res() response: Response,
  ){
    try {
      const updatedHabit = await this.habitsService.updateHabit(
        id,
        habit,
      );
      return response.status(200).json({
        message: "habit updated successfully",
        success: true,
        data: updatedHabit,
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || "failed to process request",
        success: false,
      });
    }
  }

  @Delete(':id')
  async deleteHabit(
    @CurrentUser() authInfo: AuthInfo,
    @Param('id') id: string,
    @Res() response: Response,
  ){
    try {
      await this.habitsService.deleteHabit(id);
      return response.status(200).json({
        message: "habit deleted successfully",
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
