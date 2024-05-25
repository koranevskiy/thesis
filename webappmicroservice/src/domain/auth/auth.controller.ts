import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { RegisterDto } from 'src/domain/auth/dto/register.dto'

@ApiTags('Аутентификация | Регистрация')
@Controller('/auth')
export class AuthController{

  @Post('login')
  async login(){

  }

  @Post('/register')
  async register(@Body() dto: RegisterDto) {

  }
}