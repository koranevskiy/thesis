import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { DatabaseConfig, databaseConfig } from '#config/database.config'
import { appConfig } from '#config/app.config'
import { TypeOrmModule } from '@nestjs/typeorm'

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
  })],
  controllers: [],
  providers: [],
})
export class AppModule {
}
