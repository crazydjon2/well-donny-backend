import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './users.service';
// import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';
import { Request } from 'express';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @Get()
  getUser(@UserId() user_id: string): Promise<User | null> {
    return this.userService.getUser(user_id);
  }

  // @Get('users/:id')
  // getUserById(@Param() params): string {
  //   return this.userService.getUserById(params.id);
  // }

  @Post()
  createUser(@Body() userDTO: CreateUserDto): boolean {
    return this.userService.createUser(userDTO);
  }
}
