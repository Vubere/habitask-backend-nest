import { PaginationAndSort } from './../../../utils/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../typeorm/entities/User';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { CreateUserType, UpdateUserType, FindUserType } from '../types';
import { getOffset, hashPassword, verifyPassword } from '../../../utils/helpers';
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async signUp(user: CreateUserType) {
    const validateUser = await this.userRepository.findOne({
      where: {
        email: user.email,
      },
    });
    if (validateUser) {
      throw new Error('Email already exists');
    }
    const validateUsername = await this.userRepository.findOne({
      where: {
        username: user.username,
      },
    });
    if (validateUsername) {
      throw new Error('Username already exists');
    }
    const hashedPassword = await hashPassword(user.password);
    user.password  = hashedPassword;
    const newUser = this.userRepository.create({
      ...user,
    });
    return this.userRepository.save(newUser);
  }
  async login(usernameOrEmail: string, password: string) {
    const user = await this.userRepository.findOne({
      where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    if (!user) {
      throw new Error('Invalid username or password');
    }
    if (!await verifyPassword(password, user.password)) {
      throw new Error('Invalid username or password');
    }
    const token = await this.jwtService.signAsync({
      user_id: user.id,
      username: user.username,
      email: user.email,
      role: user.is_admin ? 'admin' : 'user',
    });
    return {
      token,
      user,
    };
  }
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
        ...where,
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
  findUserByUsernameOrEmail(usernameOrEmail: string) {
    return this.userRepository.findOne({
      where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
  }
  createUser(userDetails: CreateUserType) {
    const newUser = this.userRepository.create({
      ...userDetails,
    });
    return this.userRepository.save(newUser);
  }
  updateUser(id: string, user: UpdateUserType) {
    return this.userRepository.update(id, user);
  }
  deleteUser(id: string) {
    return this.userRepository.delete(id);
  }
}
