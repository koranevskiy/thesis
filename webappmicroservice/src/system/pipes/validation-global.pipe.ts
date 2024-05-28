import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ValidationException } from "#system/exceptions/validation.exception";

@Injectable()
export class ValidationGlobalPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (metadata.type === "param") {
      return value;
    }
    if (metadata.type === "query" && typeof value !== "object") {
      return value;
    }
    if (metadata.type === "custom") {
      return value;
    }
    const instance = plainToInstance(metadata.metatype, value);
    const errors = await validate(instance, {
      whitelist: true,
      validateNested: true,
    });
    if (errors.length) {
      const detailErrorInfo = {};
      for (const error of errors) {
        const errorsStack = [{ error, path: error.property }];

        while (errorsStack.length) {
          const el = errorsStack.pop();
          if (el.error.constraints) {
            detailErrorInfo[el.path] = Object.values(el.error.constraints).join(".");
          }
          if (el.error.children?.length) {
            for (const child of el.error.children) {
              errorsStack.push({ error: child, path: `${el.path}.${child.property}` });
            }
          }
        }
      }
      throw new ValidationException(detailErrorInfo);
    }

    return instance;
  }
}
