import {  Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { DatabaseConfig, databaseConfig } from '#config/database.config'
import { appConfig } from '#config/app.config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from 'src/app.controller'
import { LoggerModule } from '#system/logger/logger.module'
import { CustomLogger } from '#system/logger/logger'
import { AuthJwtModule } from '#system/auth/auth-jwt.module'
import { AuthModule } from 'src/domain/auth/auth.module'

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: `.env.${process.env.NODE_ENV}`,
    isGlobal: true,
    ignoreEnvFile: process.env.NODE_ENV !== 'local',
    load: [databaseConfig, appConfig],
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => {
      const dbCfg = configService.get<DatabaseConfig>('database')
      return dbCfg
    },
    inject: [ConfigService]
  }),
    LoggerModule,
    AuthJwtModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [CustomLogger]
})
export class AppModule {
}
