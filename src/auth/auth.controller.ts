import { Controller, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('signIn')
  signIn(@Req() req: Request): { token: string } {
    return { token: this.authService.signUser(req) };
  }
}
