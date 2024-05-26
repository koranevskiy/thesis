import { HttpStatus, Injectable } from '@nestjs/common'
import { AuthJwtService } from '#system/auth/auth-jwt.service'
import { RegisterDto } from 'src/domain/auth/dto/register.dto'
import { DefaultRolesEnum } from 'src/domain/auth/roles.enum'
import { DomainException } from '#system/exceptions/domain.exception'
import { UserService } from 'src/domain/user/user.service'
import { LoginDto } from 'src/domain/auth/dto/login.dto'
import { UserException } from 'src/domain/user/exceptions/user.exception'
import { UserDto } from 'src/domain/user/dto/user.dto'
import { RefreshToken } from 'src/domain/auth/refresh-token.entity'
import { RefreshDto } from 'src/domain/auth/dto/refresh.dto'
import { TokensDto } from 'src/domain/auth/dto/login-response.dto'
import { OperatioResponseDto } from 'src/utils/swagger/dto/operatio-response.dto'


@Injectable()
export class AuthService{
  constructor(private readonly jwtService: AuthJwtService, private userService: UserService) {}

  async register(dto: RegisterDto) {
    if(dto.role === DefaultRolesEnum.Admin) {
      throw new DomainException({code: HttpStatus.BAD_REQUEST, message: 'Регистрация админов не реализована'})
    }
    const isUserExist = await this.userService.checkUserExistByEmail(dto.email)
    if(isUserExist) {
      UserException.throwExist('email', dto.email)
    }
    const hashPassword = await this.jwtService.hashPassword(dto.password)
    return this.userService.createUser({
      first_name: dto.firstName,
      last_name: dto.lastName,
      middle_name: dto.middleName,
      email: dto.email,
      password: hashPassword.hash,
      salt: hashPassword.salt
    }, dto.role)
  }

  async login(dto: LoginDto) {
    const user = await this.userService.findUserByIdOrEmail({email: dto.email}, true) as UserDto
    const isPasswordValid = await this.jwtService.comparePassword(dto.password, user.password, user.salt)
    if(!isPasswordValid) {
      throw new DomainException({code: HttpStatus.BAD_REQUEST, message: 'Логин или пароль не верны'})
    }
    const token = await this.jwtService.sign({user_id: user.user_id})
    delete user.password
    delete user.salt

    let refreshToken = await RefreshToken.findOneBy({user_id: user.user_id})
    if(!refreshToken) {
      refreshToken = new RefreshToken()
      refreshToken.user_id = user.user_id
      refreshToken = await refreshToken.save()
    } else {
      // обновляем update_at => время истечения обновится
      refreshToken.user_id = user.user_id
      await refreshToken.save()
    }

    return {
      user,
      tokens: {
        access_token: token,
        refresh_token: refreshToken.uuid
      }
    }
  }

  async logout(user_id: number): Promise<OperatioResponseDto> {
    const refreshToken = await RefreshToken.findOneBy({user_id})
    if(!refreshToken) {
      return {
        message: 'Успешно',
        success: true
      }
    }
    await refreshToken.remove()
    return {
      message: 'Успешно',
      success: true
    }
  }

  async refresh(dto: RefreshDto): Promise<TokensDto> {
    const refreshToken = await RefreshToken.findOneBy({
      uuid: dto.refresh_token
    })
    if(!refreshToken) {
      throw new DomainException({code: HttpStatus.BAD_REQUEST, message: 'Невалидный токен'})
    }
    // определяем кол-во пройденных дней
    const dayQntPassed = Math.ceil((Date.now() - +refreshToken.update_at) / (1000 * 60 * 24))
    if(dayQntPassed >= 30) {
      throw new DomainException({code: HttpStatus.UNAUTHORIZED, message: 'Рефрешь токен истек'})
    }
    // обновляем время жизни токена
    await refreshToken.save()

    const access_token = await this.jwtService.sign({user_id: refreshToken.user_id})
    return {
      access_token,
      refresh_token: refreshToken.uuid
    }
  }

}