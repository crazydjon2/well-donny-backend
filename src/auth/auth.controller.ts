import { Controller, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/users/user.entity';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('signIn')
  signIn(@Req() req: Request): Promise<User | null> | null {
    return this.authService.signUser(req);
  }
}
