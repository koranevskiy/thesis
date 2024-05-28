import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, LoggerService } from "@nestjs/common";
import { DomainException } from "#system/exceptions/domain.exception";
import { Request, Response } from "express";
import { DatabaseError } from "pg-protocol";
import { ValidationException } from "#system/exceptions/validation.exception";
@Catch()
class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}
  catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const timestamp = new Date().toISOString();
    const path = request.path;

    if (exception instanceof DomainException) {
      const statusCode = exception.clientInformation.code ?? HttpStatus.INTERNAL_SERVER_ERROR;
      delete exception.clientInformation.code;
      this.logger.error(Object.assign(exception, { name: exception.name, type: "Domain" }));
      return response.status(statusCode).json(
        Object.assign(exception.clientInformation, {
          timestamp,
          path: request.path,
        })
      );
    }

    if (exception instanceof DatabaseError) {
      this.logger.error(Object.assign(exception, { type: "Database" }));
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: "Ошибка базы данных",
        path,
        timestamp,
      });
    }

    if (exception instanceof ValidationException) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Не валидные данные", type: "Validation", errors: exception.errors });
    }
    this.logger.error(Object.assign(exception, { type: "Server" }));
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Ошибка сервера",
      path,
      timestamp,
    });
  }
}

export { GlobalExceptionFilter };
