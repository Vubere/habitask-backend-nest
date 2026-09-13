import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res } from '@nestjs/common';
import { HabitOccurencesService } from "../service/habit-occurences.service";
import { CurrentUser } from "../../users/decorators/user.decorator";
import { FindHabitOccurenceQuery } from "../dtos/FindHabitOcurrence.dto";
import type { Response } from "express";
import { PaginationAndSortDto } from "../../general/dtos/pagination_and_sort_dto";
import { CreateHabitOccurenceDto, UpdateHabitOccurenceDto } from "../dtos/HabitOccurence.dto";
import type { AuthInfo } from "../../users/types";

@Controller('habit-occurences')
export class HabitOccurencesController {
  constructor(private readonly habitOccurencesService: HabitOccurencesService) {}

  @Get()
  async getHabitOccurences(
    @CurrentUser() authInfo: AuthInfo,
    @Query() query: FindHabitOccurenceQuery,
    @Query() pagination: PaginationAndSortDto,
    @Res() response: Response,
  ){
    if (authInfo.role !== "admin") {
      query.user_id = authInfo.user_id;
    }
    try {
      const habitOccurences = await this.habitOccurencesService.findHabitOccurences(
        query,
        pagination,
      );
      return response.status(200).json({
        "data": habitOccurences,
        "pagination": pagination,
        "success": true,
        "message": "habit occurences retrieved successfully",
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || "failed to process request",
        success: false,
      });
    }
  }
  @Get(':id')
  async getHabitOccurenceById(
    @CurrentUser() authInfo: any,
    @Param('id') id: string,
    @Res() response: Response,
  ){
    try {
      if (authInfo.role !== "admin") {
        id = authInfo.user_id;
      }
      const habitOccurence = await this.habitOccurencesService.findHabitOccurence(id);
      return response.status(200).json({
        data: habitOccurence,
        success: true,
        message: "habit occurence retrieved successfully",
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || "failed to process request",
        success: false
      });
    }
  }

  @Get('summary')
  async getHabitOccurenceSummary(
    @CurrentUser() authInfo: AuthInfo,
    @Query() query: FindHabitOccurenceQuery,
    @Query() pagination: PaginationAndSortDto,
    @Res() response: Response,
  ){
    if (authInfo.role !== "admin") {
      query.user_id = authInfo.user_id;
    }
    try {
      const habitOccurenceSummaries = await this.habitOccurencesService.getHabitOccurenceSummary(
        query,
        pagination
      );
      return response.status(200).json({
        "data": habitOccurenceSummaries,
        "pagination": pagination,
        "success": true,
        "message": "habit occurence summaries retrieved successfully",
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || "failed to process request",
        success: false,
      });
    }
  }

  @Post()
  async createHabitOccurence(
    @CurrentUser() authInfo: AuthInfo,
    @Body() habitOccurence: CreateHabitOccurenceDto,
    @Res() response: Response,
  ){
    try {
      const habitOccurencePayload: any = {
        ...habitOccurence,
        user_id: authInfo.user_id,
      };
      await this.habitOccurencesService.createHabitOccurence(
        habitOccurencePayload,
      );
      return response.status(201).json({
        message: "habit occurence created successfully",
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
  async updateHabitOccurence(
    @Param('id') id: string,
    @Body() habitOccurence: UpdateHabitOccurenceDto,
    @Res() response: Response,
  ){
    try {
      const updatedHabitOccurence = await this.habitOccurencesService.updateHabitOccurence(
        id,
        habitOccurence,
      );
      return response.status(200).json({
        message: "habit occurence updated successfully",
        success: true,
        data: updatedHabitOccurence,
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || "failed to process request",
        success: false,
      });
    }
  }

  @Delete(':id')
  async deleteHabitOccurence(
    @CurrentUser() authInfo: any,
    @Param('id') id: string,
    @Res() response: Response,
  ){
    try {
      await this.habitOccurencesService.deleteHabitOccurence(id);
      return response.status(200).json({
        message: "habit occurence deleted successfully",
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
