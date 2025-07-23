import { Controller, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('signIn')
  signIn(@Req() req: Request): { token: string } {
    return { token: this.authService.signUser(req) };
  }
}
