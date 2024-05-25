import { Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Аутентификация | Регистрация')
@Controller('/auth')
export class AuthController{

  @Post('login')
  async login(){

  }
}