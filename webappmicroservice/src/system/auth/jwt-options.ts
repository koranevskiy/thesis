import { Injectable } from "@nestjs/common";
import { JwtModuleOptions, JwtOptionsFactory } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { AppConfig } from "#config/app.config";

@Injectable()
export class JwtOptions implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
    const appConfig = this.configService.get<AppConfig>("app");
    return {
      secret: appConfig.jwtSecretKey,
      signOptions: {
        expiresIn: appConfig.accessTokenExpireTime,
      },
    };
  }
}
