import { Module } from '@nestjs/common'
import { AuthJwtModule } from '#system/auth/auth-jwt.module'
import { AuthService } from 'src/domain/auth/auth.service'
import { AuthController } from 'src/domain/auth/auth.controller'


@Module({
  imports: [AuthJwtModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule{}