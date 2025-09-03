// auth.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async signUser(req: Request): Promise<{ token: string }> {
    // const authHeader = req.headers.authorization;
    const deviceId = req.headers['x-tg-id'] as string;
    if (deviceId) {
      const user = await this.userService.getUserByTgId(+deviceId);
      if (user?.id) {
        const token = this.jwtService.sign({ sub: deviceId });
        return { token };
      }
      throw new NotFoundException('No User');
    }
    throw new BadRequestException('There is no x-tg-id in req', {
      cause: new Error(),
    });
  }

  verifyToken(token: string): number {
    const tgId: { sub: number } = this.jwtService.decode(token);
    return tgId.sub;
  }
}
