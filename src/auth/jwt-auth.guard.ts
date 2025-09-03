import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { UserService } from 'src/users/users.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader;

    try {
      const decoded: { sub: number } = this.jwtService.verify(token);
      request['tg_id'] = decoded.sub; // ✅ Attach decoded token to request
      const user = await this.userService.getUserByTgId(decoded.sub);
      if (user) {
        request['user_id'] = user?.id;
      }
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
