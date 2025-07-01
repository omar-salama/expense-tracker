import { ApiProperty } from '@nestjs/swagger';

export class RequestUserDto {
  @ApiProperty()
  id: number;
}
