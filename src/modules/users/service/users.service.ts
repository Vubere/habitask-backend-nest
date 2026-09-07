import { PaginationAndSort } from './../../../utils/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../../typeorm/entities/User";
import { FindOptionsWhere, ILike, Repository } from "typeorm";
import { CreateUserType, UpdateUserType, FindUserType } from "../types";
import { getOffset } from "../../../utils/helpers";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}
  findUsers(filter: FindUserType, pagination: PaginationAndSort) {
    const where: FindOptionsWhere<User> = {};
    if (filter.search) {
      where.username = ILike(`%${filter.search}%`);
      where.email = ILike(`%${filter.search}%`);
      where.first_name = ILike(`%${filter.search}%`);
      where.last_name = ILike(`%${filter.search}%`);
      where.profession = ILike(`%${filter.search}%`);
    }
    if (filter.active) {
      where.is_active = filter.active;
    }
    if (filter.admin) {
      where.is_admin = filter.admin;
    }
    if (filter.username) {
      where.username = filter.username;
    }
    if (filter.email) {
      where.email = filter.email;
    }
    if (filter.first_name) {
      where.first_name = filter.first_name;
    }
    if (filter.last_name) {
      where.last_name = filter.last_name;
    }
    if (filter.profession) {
      where.profession = filter.profession;
    }
    return this.userRepository.find({
      where: {
       ...where
      },
      skip: getOffset(pagination.page, pagination.per_page),
      take: pagination.per_page,
      order: {
        [pagination.sort_by]: pagination.sort_direction,
      },
    });
  }
  findUserById(id: string) {
    return this.userRepository.findOne({
      where: {
        id: id,
      },
    });
  }
  findUserByToken(token: string) {
    return this.userRepository.findOne({
      where: {
        token: token,
      },
    });
  }
  findUserByEmail(email: string) {
    return this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }
  findUserByUsername(username: string) {
    return this.userRepository.findOne({
      where: {
        username: username,
      },
    });
  }
  createUser(userDetails: CreateUserType)  {
    const newUser = this.userRepository.create({
      ...userDetails,
    })
    return this.userRepository.save(newUser);
  }
  updateUser(id:string, user: UpdateUserType) {
    return this.userRepository.update(id, user);
  }
  deleteUser(id: string) {
    return this.userRepository.delete(id);
  }
}
