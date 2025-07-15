import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { UserService } from './users.service';
// import { CreateUserDto } from './create-user.dto';
import { User } from './user.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  getUser(@Req() req: Request & { tg_id: number }): Promise<User | null> {
    return this.userService.getUser(req.tg_id);
  }

  // @Get('users/:id')
  // getUserById(@Param() params): string {
  //   return this.userService.getUserById(params.id);
  // }

  @Post('user')
  createUser(@Body() CreateUserDto): boolean {
    return this.userService.createUser(CreateUserDto);
  }
}
