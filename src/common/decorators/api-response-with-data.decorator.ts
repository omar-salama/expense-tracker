import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiResponseDto } from '../api-response.dto';

export function ApiResponseWithData(
  dataType: Type<unknown> | [Type<unknown>],
  status = 200,
) {
  const dataSchema = Array.isArray(dataType)
    ? { type: 'array', items: { $ref: getSchemaPath(dataType[0]) } }
    : { $ref: getSchemaPath(dataType as Type<unknown>) };

  return applyDecorators(
    ApiResponse({
      status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(ApiResponseDto) },
          {
            properties: {
              data: dataSchema,
              message: { type: 'string' },
              status: { type: 'number' },
            },
          },
        ],
      },
    }),
  );
}
