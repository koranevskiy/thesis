import { ApiProperty } from "@nestjs/swagger";

export class OperatioResponseDto {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;
}
