import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthJwtService } from '#system/auth/auth-jwt.service'
import { Request } from 'express'


@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: AuthJwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractToken(request)
    if (!token) {
      throw new UnauthorizedException()
    }
    try {
      const payload = await this.jwtService.verify({token: token})
      request['user_id'] = payload.user_id
    } catch {
      throw new UnauthorizedException()
    }
    return true
  }

  private extractToken(req: Request) {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}