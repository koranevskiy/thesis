import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { JwtOptions } from '#system/auth/jwt-options'
import { ConfigModule } from '@nestjs/config'
import { AuthJwtService } from '#system/auth/auth-jwt.service'


@Module({
  imports: [JwtModule.registerAsync({
    useClass: JwtOptions,
    imports: [ConfigModule],
  })],
  providers: [AuthJwtService],
  exports: [AuthJwtService]
})
export class AuthJwtModule {}