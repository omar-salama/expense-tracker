import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestUserDto } from '../dto/request-user.dto';

export const RequestUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestUserDto => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
