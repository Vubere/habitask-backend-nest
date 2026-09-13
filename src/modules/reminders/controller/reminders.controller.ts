import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res } from '@nestjs/common';
import { RemindersService } from "../service/reminders.service";
import { CurrentUser } from "../../users/decorators/user.decorator";
import { QueryReminderDto } from "../dto/QueryReminder.dto";
import { PaginationAndSortDto } from "../../general/dtos/pagination_and_sort_dto";
import type { Response } from "express";
import type { AuthInfo } from "../../users/types";
import { CreateReminderDto } from "../dto/CreateReminder.dto";
import { UpdateReminderDto } from "../dto/UpdateReminder.dto";

@Controller('reminders')
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}
 
  @Get()
  async getReminders(
    @CurrentUser() authInfo: AuthInfo,
    @Query() query: QueryReminderDto,
    @Query() pagination: PaginationAndSortDto,
    @Res() response: Response,
  ){
    if (authInfo.role !== "admin") {
      query.user_id = authInfo.user_id;
    }
    try {
      const reminders = await this.remindersService.findReminders(
        query,
        pagination,
      );
      return response.status(200).json({
        "data": reminders,
        "pagination": pagination,
        "success": true,
        "message": "reminders retrieved successfully",
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || "failed to process request",
        success: false,
      });
    }
  }

  @Get(':id')
  async getReminderById(
    @CurrentUser() authInfo: AuthInfo,
    @Param('id') id: string,
    @Res() response: Response,
  ){
    try {
      if (authInfo.role !== "admin") {
        id = authInfo.user_id;
      }
      const reminder = await this.remindersService.findReminder(id);
      return response.status(200).json({
        data: reminder,
        success: true,
        message: "reminder retrieved successfully",
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || "failed to process request",
        success: false
      });
    }
  }

  @Post()
  async createReminder(
    @CurrentUser() authInfo: AuthInfo,
    @Body() reminder: CreateReminderDto,
    @Res() response: Response,
  ){
    try {
      const reminderPayload: any = {
        ...reminder,
        user_id: authInfo.user_id,
      };
      await this.remindersService.createReminder(
        reminderPayload,
      );
      return response.status(201).json({
        message: "reminder created successfully",
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
  async updateReminder(
    @Param('id') id: string,
    @Body() reminder: UpdateReminderDto,
    @Res() response: Response,
  ){
    try {
      const updatedReminder = await this.remindersService.updateReminder(
        id,
        reminder,
      );
      return response.status(200).json({
        message: "reminder updated successfully",
        success: true,
        data: updatedReminder,
      });
    } catch (error) {
      return response.status(400).json({
        message: (error as any)?.message || "failed to process request",
        success: false,
      });
    }
  } 
  @Delete(':id')
  async deleteReminder(
    @CurrentUser() authInfo: AuthInfo,
    @Param('id') id: string,
    @Res() response: Response,
  ){
    try {
      await this.remindersService.deleteReminder(id);
      return response.status(200).json({
        message: "reminder deleted successfully",
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
