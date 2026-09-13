import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res } from '@nestjs/common';
import { TasksService } from "../service/tasks.service";
import { CurrentUser } from "../../users/decorators/user.decorator";
import type { AuthInfo } from "../../users/types";
import { TaskQueryDto } from "../dtos/TaskQueryDto";
import { PaginationAndSortDto } from "../../general/dtos/pagination_and_sort_dto";
import type { Response } from "express";
import { UpdateTaskDto } from "../dtos/UpdateTaskDto";
import { TaskCreateType } from "../types";
import { CreateTaskDto } from "../dtos/CreateTaskDto";

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getTasks(
    @CurrentUser() authInfo: AuthInfo,
    @Query() query: TaskQueryDto,
    @Query() pagination: PaginationAndSortDto,
    @Res() response: Response,
  ){
    if (authInfo.role !== "admin") {
      query.user_id = authInfo.user_id;
    }
    try {
      const tasks = await this.tasksService.findTasks(query, pagination);
      return response.status(200).json({
        "data": tasks,
        "pagination": pagination,
        "success": true,
        "message": "tasks retrieved successfully",
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || "failed to process request",
        success: false,
      });
    }
  }
  @Get(':id')
  async getTaskById(
    @CurrentUser() authInfo: AuthInfo,
    @Param('id') id: string,
    @Res() response: Response,
  ){
    try {
      if (authInfo.role !== "admin") {
        id = authInfo.user_id;
      }
      const task = await this.tasksService.findTasksById(id);
      return response.status(200).json({
        data: task,
        success: true,
        message: "task retrieved successfully",
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || "failed to process request",
        success: false
      });
    }
  }

  @Get('summary')
  async getTaskSummary(
    @CurrentUser() authInfo: AuthInfo,
    @Query() query: TaskQueryDto,
    @Query() pagination: PaginationAndSortDto,
    @Res() response: Response,
  ){
    if (authInfo.role !== "admin") {
      query.user_id = authInfo.user_id;
    }
    try {
      const taskSummaries = await this.tasksService.findTaskSummary(
        query,
        pagination
      );
      return response.status(200).json({
        "data": taskSummaries,
        "pagination": pagination,
        "success": true,
        "message": "task summaries retrieved successfully",
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || "failed to process request",
        success: false,
      });
    }
  }

  @Post()
  async createTask(
    @CurrentUser() authInfo: AuthInfo,
    @Body() task: CreateTaskDto,
    @Res() response: Response,
  ){
    try {
      const taskPayload: TaskCreateType = {
        ...task,
        user_id: authInfo.user_id,
      };
      await this.tasksService.createTask(
        taskPayload,
      );
      return response.status(201).json({
        message: "task created successfully",
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
  async updateTask(
    @CurrentUser() authInfo: AuthInfo,
    @Param('id') id: string,
    @Body() task: UpdateTaskDto,
    @Res() response: Response,
  ){
    try {
      const updatedTask = await this.tasksService.updateTask(
        id,
        task,
      );
      return response.status(200).json({
        message: "task updated successfully",
        success: true,
        data: updatedTask,
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || "failed to process request",
        success: false,
      });
    }
  }

  @Delete(':id')
  async deleteTask(
    @CurrentUser() authInfo: AuthInfo,
    @Param('id') id: string,
    @Res() response: Response,
  ){
    try {
      await this.tasksService.deleteTask(id);
      return response.status(200).json({
        message: "task deleted successfully",
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
