import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request: Record<string, string> = ctx.switchToHttp().getRequest();
    return request.user_id; // make sure JwtAuthGuard sets this
  },
);
