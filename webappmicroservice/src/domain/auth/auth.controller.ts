import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiExtraModels, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RegisterDto } from "src/domain/auth/dto/register.dto";
import { AuthService } from "src/domain/auth/auth.service";
import { LoginDto } from "src/domain/auth/dto/login.dto";
import { ApiResponseCustom } from "#system/decorators/swagger-response.decorator";
import { LoginResponseDto, TokensDto } from "src/domain/auth/dto/login-response.dto";
import { UserDto } from "src/domain/user/dto/user.dto";
import { AuthGuard } from "src/domain/auth/guards/auth.guard";
import { RefreshDto } from "src/domain/auth/dto/refresh.dto";
import { UserId } from "#system/decorators/user-id.decorator";
import { OperatioResponseDto } from "src/utils/swagger/dto/operatio-response.dto";

@ApiExtraModels(LoginResponseDto, OperatioResponseDto)
@ApiTags("Аутентификация | Регистрация")
@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  @ApiResponseCustom(201, LoginResponseDto)
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post("/register")
  @ApiResponseCustom(201, UserDto)
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post("/logout")
  @ApiResponseCustom(201, OperatioResponseDto)
  @UseGuards(AuthGuard)
  async logout(@UserId() user_id: number) {
    return this.authService.logout(user_id);
  }

  @Post("/refresh")
  @ApiResponseCustom(201, TokensDto)
  async refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto);
  }
}
