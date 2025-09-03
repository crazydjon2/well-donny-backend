import { Controller, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('signIn')
  async signIn(@Req() req: Request): Promise<{ token: string }> {
    return this.authService.signUser(req);
  }
}
