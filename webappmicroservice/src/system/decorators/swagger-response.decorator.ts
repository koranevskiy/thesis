import { applyDecorators } from "@nestjs/common";
import { ApiResponse, ApiResponseMetadata, getSchemaPath } from "@nestjs/swagger";

export const ApiResponseCustom = (status: number, type: any, options?: ApiResponseMetadata) => {
  const data =
    options && options.isArray
      ? {
          type: "array",
          items: { allOf: [{ $ref: getSchemaPath(type) }] },
        }
      : { type: "object", allOf: [{ $ref: getSchemaPath(type) }] };
  return applyDecorators(
    ApiResponse({
      status,
      description: options?.description,
      schema: {
        allOf: [
          {
            properties: {
              data,
              meta: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                  },
                  statusCode: {
                    type: "number",
                  },
                },
              },
            },
          },
        ],
      },
    })
  );
};
