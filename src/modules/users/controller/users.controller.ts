import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UserLoginDto,
} from '../dtos/CreateUser.dto';
import type { Request, Response } from 'express';
import { CurrentUser } from '../decorators/user.decorator';
import type { AuthInfo, FindUserType } from '../types';
import { PaginationAndSortDto } from '../../general/dtos/pagination_and_sort_dto';
import { SetPublic } from "../../general/decorators/public.decorator";

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  async createUser(@Body() user: CreateUserDto) {
    try {
      const res = await this.userService.createUser(user);
      return res;
    } catch (error) {
      console.log(error);
    }
  }
  @SetPublic()
  @Post('signup')
  async signUp(@Body() user: CreateUserDto, @Res() response: Response) {
    try {
      await this.userService.signUp(user);
      return response.status(201).json({
        message: 'profile created successfully',
      });
    } catch (error) {
      return response.status(400).json({
        error,
      });
    }
  }

  @SetPublic()
  @Post('login')
  async login(@Body() userData: UserLoginDto, @Res() response: Response) {
    try {
      const { token, user } = await this.userService.login(
        userData.email,
        userData.password,
      );
      return response.status(200).json({
        token,
        user,
      });
    } catch (error) {
      return response.status(400).json({
        error,
      });
    }
  }
  @Get('me')
  async getMe(
    @CurrentUser() authInfo: AuthInfo,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    try {
      const user = await this.userService.findUserById(authInfo.user_id);
      return response.status(200).json({
        user,
      });
    } catch (error) {
      return response.status(400).json({
        error,
      });
    }
  }
  @Get()
  async getUsers(
    @CurrentUser() authInfo: AuthInfo,
    @Query() query: FindUserType,
    @Query() pagination: PaginationAndSortDto,
    @Res() response: Response,
  ) {
    try {
      const users = await this.userService.findUsers(query, {
        page: pagination.page,
        per_page: pagination.per_page,
        sort_by: pagination.sort_by,
        sort_direction: pagination.sort_direction,
      });
      return response.status(200).json({
        users,
      });
    } catch (error) {
      return response.status(400).json({
        error,
      });
    }
  }

  @Get(':id')
  async getUserById(
    @CurrentUser() authInfo: AuthInfo,
    @Param('id') id: string,
    @Res() response: Response,
  ) {
    try {
      const user = await this.userService.findUserById(id);
      return response.status(200).json({
        user,
      });
    } catch (error) {
      return response.status(400).json({
        error,
      });
    }
  }
  @Put(':id')
  async updateUserById(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
    @Res() response: Response,
  ) {
    try {
      const updatedUser = await this.userService.updateUser(id, user);
      return response.status(200).json({
        message: 'user updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      return response.status(400).json({
        error,
      });
    }
  }
  @Put()
  async updateMe(
    @CurrentUser() authInfo: AuthInfo,
    @Body() user: UpdateUserDto,
    @Res() response: Response,
  ) {
    try {
      const userId = authInfo.user_id;
      const updatedUser = await this.userService.updateUser(userId, user);
      return response.status(200).json({
        message: 'user updated successfully',
        user: updatedUser,
      });
    } catch (error) {
      return response.status(400).json({
        error,
      });
    }
  }

  @Delete()
  async deleteUser(
    @CurrentUser() authInfo: AuthInfo,
    @Res() response: Response,
  ) {
    try {
      const userId = authInfo.user_id;
      await this.userService.deleteUser(userId);
      return response.status(200).json({
        message: 'user deleted successfully',
      });
    } catch (error) {
      return response.status(400).json({
        error,
      });
    }
  }
}
