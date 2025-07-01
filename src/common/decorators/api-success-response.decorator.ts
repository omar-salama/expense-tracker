import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiResponseDto } from '../api-response.dto';
import { ApiPaginatedResponseDto } from '../api-paginated-response.dto';

export function ApiSuccessResponse(
  dataType?: Type<unknown> | [Type<unknown>],
  status = 200,
  options: { withMetaData?: boolean } = {},
) {
  const properties: Record<string, any> = {
    message: { type: 'string' },
    status: { type: 'string', example: 'success' },
  };

  if (dataType) {
    properties.data = Array.isArray(dataType)
      ? { type: 'array', items: { $ref: getSchemaPath(dataType[0]) } }
      : { $ref: getSchemaPath(dataType as Type<unknown>) };
  }

  if (options.withMetaData) {
    properties.meta = {
      type: 'object',
      properties: {
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        total: { type: 'number', example: 100 },
      },
    };
  }

  return applyDecorators(
    ApiResponse({
      status,
      schema: {
        properties,
      },
    }),
  );
}
