// auth.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  signUser(req: Request): string {
    // const authHeader = req.headers.authorization;
    const deviceId = req.headers['x-tg-id'] as string;
    if (deviceId) {
      const token = this.jwtService.sign({ sub: deviceId });
      return token;
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
