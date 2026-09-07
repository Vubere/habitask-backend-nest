import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from "../service/users.service";
import { CreateUserDto } from "../dtos/CreateUser.dto";

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post()
  async createUser(@Body() user: CreateUserDto) {
    try {
      const res = await this.userService.createUser(user)
      return res
    } catch (error) {
      console.log(error);
    }
  }
}
