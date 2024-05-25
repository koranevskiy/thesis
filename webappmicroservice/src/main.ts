import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config'
import { AppConfig } from '#config/app.config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { GlobalExceptionFilter } from '#system/filters/global-exception.filter'
import { CustomLogger } from '#system/logger/logger'


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  const appCfg = configService.get<AppConfig>('app')

  //  swagger
  app.setGlobalPrefix('api/v1');
  const swaggerConfig = new DocumentBuilder()
    .setTitle('API Documentation')
    .setVersion('0.0.1')
    .addSecurity('bearer', {
      type: 'http',
      scheme: 'bearer',
    })
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/v1/docs', app, document);

  //  logger
  const loggerService = new CustomLogger(configService)
  app.useLogger(loggerService)
  app.useGlobalFilters(new GlobalExceptionFilter(loggerService))

  await app.listen(appCfg.apiPort);
}
bootstrap();
