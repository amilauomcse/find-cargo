import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserFromJwt {
  sub: number;
  email: string;
  role: string;
  organizationId: number;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserFromJwt => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
