import { Controller, Get, Param,  Post, Body } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';
import { Request } from 'express';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { CreateUserDto } from './create-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  // @Get('users/:id')
  // getUserById(@Param() params): string {
  //   return this.userService.getUserById(params.id);
  // }

  @Post('user')
  createUser(@Body() userDTO: CreateUserDto): boolean {
    return this.userService.createUser(userDTO);
  }
}
