import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import config from "src/config/app.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
      ignoreEnvFile: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
