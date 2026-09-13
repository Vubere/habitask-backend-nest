import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res } from '@nestjs/common';
import { TaskStepsService } from "../service/task-steps.service";
import { CurrentUser } from "../../users/decorators/user.decorator";
import type { AuthInfo } from "../../users/types";
import { TaskQueryDto } from "../../tasks/dtos/TaskQueryDto";
import { PaginationAndSortDto } from "../../general/dtos/pagination_and_sort_dto";
import type { Response } from "express";
import { UpdateTaskStepDto } from "../dto/UpdateTaskStep.dto";
import { CreateTaskStepDto } from "../dto/CreateTaskStep.dto";
import { TaskStepCreateType } from "../types";

@Controller('task-steps')
export class TaskStepsController {
  constructor(private readonly taskStepsService: TaskStepsService) {}

  @Get()
  async getTaskSteps(
    @CurrentUser() authInfo: AuthInfo,
    @Query() taskStepQuery: TaskQueryDto,
    @Query() pagination: PaginationAndSortDto,
    @Res() response: Response, 
  ){
    if (authInfo.role != "admin") {
      taskStepQuery.user_id = authInfo.user_id
    }
    try {
      const tasks = await this.taskStepsService.findTaskSteps(
        taskStepQuery,
        pagination
      );
      return response.status(200).json({
        "data": tasks,
        "pagination": pagination,
        "success": true,
        "message": "task steps retrieved successfully",
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || "failed to process request",
        success: false,
      });
    }
  }

  
  async getTaskStepById(
    @CurrentUser() authInfo: AuthInfo,
    @Param('id') id: string,
    @Res() response: Response,
  ){
    try {
      if (authInfo.role !== "admin") {
        id = authInfo.user_id;
      }
      const task = await this.taskStepsService.findTaskStep(id);
      return response.status(200).json({
        data: task,
        success: true,
        message: "task step retrieved successfully",
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || "failed to process request",
        success: false
      });
    }
  }

  async getTaskStepSummary(
    @CurrentUser() authInfo: AuthInfo,
    @Query() query: TaskQueryDto,
    @Query() pagination: PaginationAndSortDto,
    @Res() response: Response,
  ){
    if (authInfo.role !== "admin") {
      query.user_id = authInfo.user_id;
    }
    try {
      const taskSummaries = await this.taskStepsService.getTaskStepSummary(
        query,
        pagination
      );
      return response.status(200).json({
        "data": taskSummaries,
        "pagination": pagination,
        "success": true,
        "message": "task step summaries retrieved successfully",
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || "failed to process request",
        success: false,
      });
    }
  }

  @Post()
  async createTaskStep(
    @CurrentUser() authInfo: AuthInfo,
    @Body() taskStep: CreateTaskStepDto,
    @Res() response: Response,
  ){
    try {
      const taskStepPayload: TaskStepCreateType = {
        ...taskStep,
        user_id: authInfo.user_id,
      };
      await this.taskStepsService.createTaskStep(
        taskStepPayload,
      );
      return response.status(201).json({
        message: "task step created successfully",
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
  async updateTaskStep(
    @Param('id') id: string,
    @Body() taskStep: UpdateTaskStepDto,
    @Res() response: Response,
  ){
    try {
      const updatedTaskStep = await this.taskStepsService.updateTaskStep(
        id,
        taskStep,
      );
      return response.status(200).json({
        message: "task step updated successfully",
        success: true,
        data: updatedTaskStep,
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || "failed to process request",
        success: false,
      });
    }
  }

  @Delete(':id')
  async deleteTaskStep(
    @CurrentUser() authInfo: AuthInfo,
    @Param('id') id: string,
    @Res() response: Response,
  ){
    try {
      await this.taskStepsService.deleteTaskStep(id);
      return response.status(200).json({
        message: "task step deleted successfully",
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
