import { applyDecorators } from '@nestjs/common'
import { ApiResponse, ApiResponseOptions, getSchemaPath } from '@nestjs/swagger'


export const ApiResponseCustom = (status: number, type: any, options?: ApiResponseOptions) => {
  return applyDecorators(
    ApiResponse({
      status,
      description: options?.description,
      schema: {
        allOf: [
          {
            properties: {
              data: {type: 'object', allOf: [{$ref: getSchemaPath(type)}]},
              meta: {
                type: 'object',
                properties: {
                  message: {
                    type: 'string'
                  },
                  statusCode: {
                    type: 'number'
                  }
                }
              },
            },
          },
        ],
      },
    })
  );
};
