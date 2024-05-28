import { UserDto } from "src/domain/user/dto/user.dto";
import { ApiProperty } from "@nestjs/swagger";

export class TokensDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;
}

export class LoginResponseDto {
  @ApiProperty({ type: UserDto })
  user: UserDto;

  @ApiProperty({ type: TokensDto })
  tokens: TokensDto;
}
