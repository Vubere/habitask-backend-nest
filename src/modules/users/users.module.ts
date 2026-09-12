import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../typeorm/entities/User";
import { AuthGuard } from "./users.auth.guard";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
