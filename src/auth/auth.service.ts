// auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { UserService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  signUser(req: Request): Promise<User | null> | null {
    // const authHeader = req.headers.authorization;
    const deviceId = req.headers['x-tg-id'] as string;
    if (deviceId) {
      const token = this.jwtService.sign({ sub: deviceId });
      return this.verifyToken(token);
    }
    return null;
  }

  verifyToken(token: string): Promise<User | null> {
    const tgId: { sub: number } = this.jwtService.decode(token);
    const user = this.userService.getUserByTgId(tgId.sub);
    return user;
  }
}
