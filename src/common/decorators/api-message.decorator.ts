import { SetMetadata } from '@nestjs/common';
import { RESPONSE_MESSAGE_KEY } from '../response-format.interceptor';

export const ApiMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE_KEY, message);
