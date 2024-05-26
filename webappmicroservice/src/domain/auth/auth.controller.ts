import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { RegisterDto } from 'src/domain/auth/dto/register.dto'
import { AuthService } from 'src/domain/auth/auth.service'

@ApiTags('Аутентификация | Регистрация')
@Controller('/auth')
export class AuthController{

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(){

  }

  @Post('/register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto)
  }
}