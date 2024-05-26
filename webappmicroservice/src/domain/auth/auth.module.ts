import { Module } from '@nestjs/common'
import { AuthJwtModule } from '#system/auth/auth-jwt.module'
import { AuthService } from 'src/domain/auth/auth.service'
import { AuthController } from 'src/domain/auth/auth.controller'
import { UserModule } from 'src/domain/user/user.module'


@Module({
  imports: [AuthJwtModule, UserModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule{}