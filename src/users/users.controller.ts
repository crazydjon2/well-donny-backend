import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './users.service';
// import { CreateUserDto } from './create-user.dto';
import { SupportedLanguage, User } from './user.entity';
import { UserId } from 'src/common/decorators/user-id.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/common/decorators/public.decorator';

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

  @Public()
  @Post()
  createUser(@Body() userDTO: CreateUserDto): Promise<User> {
    return this.userService.createUser(userDTO);
  }

  @Put('/edit')
  editUser(
    @Body()
    dto: {
      language: SupportedLanguage;
      isPublic: boolean;
      allowNotification: boolean;
    },
    @UserId() userId: string,
  ) {
    return this.userService.editUser(userId, dto);
  }

  @Get(':id')
  getUserProfile(@Param('id') id: string) {
    return this.userService.getUserProfile(id);
  }

  @Put('/add-word')
  addWordToFavorite(@UserId() userId: string, @Body() dto: { wordId: string }) {
    return this.userService.addWordToFavorite(userId, dto.wordId);
  }

  @Delete('/remove-word')
  deleteWordFromFaVorite(
    @UserId() userId: string,
    @Body() dto: { wordId: string },
  ) {
    return this.userService.removeWordFromFavorite(userId, dto.wordId);
  }
}
