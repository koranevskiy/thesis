import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { Response } from 'express'
import { Reflector } from '@nestjs/core'
import { RESPONSE_MESSAGE } from '#system/decorators/response-message.decorator'


@Injectable()
export class ResponseInterceptor implements NestInterceptor {

  constructor(private readonly reflector: Reflector) {
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response: Response = context.switchToHttp().getResponse()
    const message = this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler())
    return next.handle().pipe(
      map((data) => {
        const obj = {
          data,
          meta: {
            statusCode: response.statusCode,
            message: message ?? '',
          },
        }
        return obj
      }),
    )
  }
}