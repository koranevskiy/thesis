import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class RoleDto {
  @ApiProperty()
  role_id: string

  @ApiProperty()
  role_name: string
}
export class UserDto {
  [x: string]: any
  @ApiProperty()
  user_id: number

  @ApiProperty()
  first_name: string

  @ApiProperty()
  last_name: string

  @ApiPropertyOptional()
  middle_name?: string

  @ApiProperty()
  email: string

  @ApiProperty({isArray: true, type: RoleDto})
  roles: RoleDto[]

  @ApiProperty()
  created_at: string

  @ApiProperty()
  updated_at: string
}