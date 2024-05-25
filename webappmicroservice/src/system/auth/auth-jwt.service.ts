import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthJwtSignPayload, AuthJwtVerifyPayload } from '#system/auth/auth-jwt.types'


@Injectable()
export class AuthJwtService{

  constructor(private readonly jwtService: JwtService) {}

  async sign(payload: AuthJwtSignPayload) {
    return this.jwtService.signAsync(payload)
  }

  async verify(payload: AuthJwtVerifyPayload) {
    return this.jwtService.verifyAsync(payload.token)
  }
}