import { applyDecorators, Type } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiResponseDto } from '../api-response.dto';
import { ApiPaginatedResponseDto } from '../api-paginated-response.dto';

export function ApiSuccessResponse(
  dataType: Type<unknown> | [Type<unknown>],
  status = 200,
  options: { withMetaData: boolean } = { withMetaData: false },
) {
  const dataSchema = Array.isArray(dataType)
    ? { type: 'array', items: { $ref: getSchemaPath(dataType[0]) } }
    : { $ref: getSchemaPath(dataType as Type<unknown>) };

  const properties: Record<string, any> = {
    data: dataSchema,
    message: { type: 'string' },
    status: { type: 'number' },
  };
  let responseDtoRef = getSchemaPath(ApiResponseDto);
  if (options.withMetaData) {
    properties.meta = {
      type: 'object',
      properties: {
        page: { type: 'number', example: 1 },
        limit: { type: 'number', example: 10 },
        total: { type: 'number', example: 100 },
      },
    };
    responseDtoRef = getSchemaPath(ApiPaginatedResponseDto);
  }

  return applyDecorators(
    ApiResponse({
      status,
      schema: {
        allOf: [{ $ref: responseDtoRef }, { properties }],
      },
    }),
  );
}
