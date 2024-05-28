import { DomainException } from "#system/exceptions/domain.exception";
import { HttpStatus } from "@nestjs/common";

export class UserException {
  static throwNotFound(searchParamName: string, value: string | number) {
    throw new DomainException({
      code: HttpStatus.NOT_FOUND,
      message: `Пользователь с ${searchParamName} = ${value} не найден`,
    });
  }

  static throwExist(existParamName: string, value: string | number) {
    throw new DomainException({
      code: HttpStatus.BAD_REQUEST,
      message: `Пользователь с ${existParamName} = ${value} уже существует`,
    });
  }
}
