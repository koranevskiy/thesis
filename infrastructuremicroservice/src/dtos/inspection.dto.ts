import { ApiProperty } from "@nestjs/swagger";

export class StateInspectionDto {
  @ApiProperty()
  Status: string;

  @ApiProperty()
  Running: boolean;

  @ApiProperty()
  Paused: boolean;

  @ApiProperty()
  Dead: boolean;

  @ApiProperty()
  Error: string;

  @ApiProperty()
  StartedAt: string;

  @ApiProperty()
  FinishedAt: string;
}

export class InspectionDto {
  @ApiProperty()
  Id: string;

  @ApiProperty()
  Created: string;

  @ApiProperty({ type: StateInspectionDto })
  State: StateInspectionDto;
}
