import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export const RESPONSE_MESSAGE_KEY = 'response_message';

@Injectable()
export class ResponseFormatInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const status = response.statusCode;
    const handler = context.getHandler();
    const message =
      this.reflector.get<string>(RESPONSE_MESSAGE_KEY, handler) ||
      'success';
    return next.handle().pipe(
      map((data) => {
        if (
          data &&
          typeof data === 'object' &&
          'data' in data &&
          'message' in data &&
          'status' in data
        ) {
          return data;
        }
        return {
          data,
          message,
          status: status <= 400 ? 'success' : 'error',
        };
      }),
    );
  }
}
