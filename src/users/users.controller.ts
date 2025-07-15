import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './users.service';
// import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  // @Get('user')
  // getUser(@Param): Promise<User | null> {
  //   return this.userService.getUser();
  // }

  // @Get('users/:id')
  // getUserById(@Param() params): string {
  //   return this.userService.getUserById(params.id);
  // }

  @Post('user')
  createUser(@Body() CreateUserDto): boolean {
    return this.userService.createUser(CreateUserDto);
  }
}
