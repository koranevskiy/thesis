import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { AppConfig } from "src/config/app.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cfg = app.get(ConfigService).get<AppConfig>("app");
  //  swagger
  app.setGlobalPrefix("api/v1");
  const swaggerConfig = new DocumentBuilder()
    .setTitle("API Documentation")
    .setVersion("0.0.1")
    .addBearerAuth({
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      in: "header",
      name: "Authorization",
    })
    .addSecurityRequirements("bearer")

    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/v1/docs", app, document, { customSiteTitle: "Infrastructure API Swagger" });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(cfg.app_port);
}
bootstrap();
