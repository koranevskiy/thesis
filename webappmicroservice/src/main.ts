import { NestFactory, Reflector } from '@nestjs/core'
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config'
import { AppConfig } from '#config/app.config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { GlobalExceptionFilter } from '#system/filters/global-exception.filter'
import { CustomLogger } from '#system/logger/logger'
import { ValidationGlobalPipe } from '#system/pipes/validation-global.pipe'
import { ResponseInterceptor } from '#system/interceptors/response.interceptor'


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  const appCfg = configService.get<AppConfig>('app')

  //  swagger
  app.setGlobalPrefix('api/v1');
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Documentation')
    .setVersion('0.0.1')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      in: 'header',
      name: 'Authorization',
    })
    .addSecurityRequirements('bearer')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/v1/docs', app, document);

  //  logger
  const loggerService = new CustomLogger(configService)
  app.useLogger(loggerService)
  app.useGlobalFilters(new GlobalExceptionFilter(loggerService))
  app.useGlobalPipes(new ValidationGlobalPipe())
  app.useGlobalInterceptors(new ResponseInterceptor(new Reflector()))

  app.enableCors({ allowedHeaders: '*', exposedHeaders: '*' });
  await app.listen(appCfg.apiPort);
}
bootstrap();
