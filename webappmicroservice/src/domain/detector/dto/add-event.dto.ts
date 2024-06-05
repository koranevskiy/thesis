import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class DetectionDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  confidence: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  label: string;
}

export class AddEventDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  camera_uuid: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  annotated_image: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  original_image: string;

  @ApiProperty({ type: DetectionDto, isArray: true })
  @ValidateNested({ each: true })
  @Type(() => DetectionDto)
  detections: DetectionDto[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  event_text: string;
}
