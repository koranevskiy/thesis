import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Controller, Get, HttpStatus, Param, ParseIntPipe } from '@nestjs/common'
import { UserService } from 'src/domain/user/user.service'
import { UserDto } from 'src/domain/user/dto/user.dto'
import { ResponseMessage } from '#system/decorators/response-message.decorator'
import { ApiResponseCustom } from '#system/decorators/swagger-response.decorator'

@ApiExtraModels(UserDto)
@ApiTags('Пользователь')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get(':user_id')
  @ApiResponseCustom(HttpStatus.OK, UserDto)
  @ResponseMessage('Пользователь получен')
  async getUser(@Param('user_id', ParseIntPipe) user_id: number) {
    return this.userService.findUserByIdOrEmail({
      user_id
    })
  }
}