import { HttpStatus, Injectable } from '@nestjs/common'
import { AuthJwtService } from '#system/auth/auth-jwt.service'
import { RegisterDto } from 'src/domain/auth/dto/register.dto'
import { DefaultRolesEnum } from 'src/domain/auth/roles.enum'
import { DomainException } from '#system/exceptions/domain.exception'


@Injectable()
export class AuthService{
  constructor(private readonly jwtService: AuthJwtService) {}

  async register(dto: RegisterDto) {
    if(dto.role === DefaultRolesEnum.Admin) {
      throw new DomainException({code: HttpStatus.BAD_REQUEST, message: 'Регистрация админов не реализована'})
    }

  }
}