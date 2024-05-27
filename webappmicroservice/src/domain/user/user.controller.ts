import { ApiExtraModels, ApiTags } from '@nestjs/swagger'
import { Controller, Get, HttpStatus, Param, ParseIntPipe, UseGuards } from '@nestjs/common'
import { UserService } from 'src/domain/user/user.service'
import { UserDto } from 'src/domain/user/dto/user.dto'
import { ResponseMessage } from '#system/decorators/response-message.decorator'
import { ApiResponseCustom } from '#system/decorators/swagger-response.decorator'
import { AuthGuard } from 'src/domain/auth/guards/auth.guard'
import { UserId } from '#system/decorators/user-id.decorator'

@ApiExtraModels(UserDto)
@ApiTags('Пользователь')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get(':user_id')
  @ApiResponseCustom(HttpStatus.OK, UserDto)
  @ResponseMessage('Пользователь получен')
  async getUserById(@Param('user_id', ParseIntPipe) user_id: number) {
    return this.userService.findUserByIdOrEmail({
      user_id
    })
  }

  @Get()
  @ApiResponseCustom(HttpStatus.OK, UserDto)
  @UseGuards(AuthGuard)
  async getUser(@UserId() user_id: number) {
    return this.userService.findUserByIdOrEmail({
      user_id
    })
  }
}