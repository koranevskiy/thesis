import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'
import { DefaultRolesEnum } from 'src/domain/auth/roles.enum'


export class RegisterDto {

  @ApiProperty()
  @IsString()
  @MaxLength(1024)
  @IsNotEmpty()
  firstName: string

  @ApiProperty()
  @IsString()
  @MaxLength(1024)
  @IsNotEmpty()
  lastName: string

  @ApiProperty()
  @IsString()
  @MaxLength(1024)
  middleName: string

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty()
  @IsString()
  @MinLength(5)
  @MaxLength(40)
  @IsNotEmpty()
  password: string

  @ApiProperty()
  @IsEnum(DefaultRolesEnum)
  @IsNotEmpty()
  role: DefaultRolesEnum
}