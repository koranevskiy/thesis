import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNotEmptyObject, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CameraConfigDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  rtsp_link: string;
}

export class AddCameraDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(200)
  camera_name: string;

  @ApiProperty({ type: CameraConfigDto })
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CameraConfigDto)
  config: CameraConfigDto;
}
