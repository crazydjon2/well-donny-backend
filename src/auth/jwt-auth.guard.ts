import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader;

    try {
      const decoded: { sub: number } = this.jwtService.verify(token);
      request['tg_id'] = decoded.sub; // ✅ Attach decoded token to request
      console.log(decoded);
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
