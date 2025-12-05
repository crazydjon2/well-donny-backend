import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const LangHeader = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const langHeader = request.headers['x-lang'];

    if (typeof langHeader === 'string') {
      return langHeader;
    }

    if (Array.isArray(langHeader) && langHeader.length > 0) {
      return langHeader[0];
    }

    return 'en'; // значение по умолчанию
  },
);
