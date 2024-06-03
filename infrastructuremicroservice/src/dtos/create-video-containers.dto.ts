import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNotEmptyObject, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class VideoContainerEnvDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  rtsp_link: string;
}

export class MinioContainerEnvDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  minio_login: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  minio_password: string;
}

export class CreateVideoContainersDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  uuid_name: string;

  @ApiProperty({ type: VideoContainerEnvDto })
  @Type(() => VideoContainerEnvDto)
  @ValidateNested()
  @IsNotEmptyObject()
  video_container: VideoContainerEnvDto;

  @ApiProperty({ type: MinioContainerEnvDto })
  @Type(() => MinioContainerEnvDto)
  @ValidateNested()
  @IsNotEmptyObject()
  minio_container: MinioContainerEnvDto;
}
