import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { DefaultRolesEnum } from "src/domain/auth/roles.enum";

export class RegisterDto {
  @ApiProperty({ example: "Виктор" })
  @IsString()
  @MaxLength(1024)
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: "Дудка" })
  @IsString()
  @MaxLength(1024)
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: "Геннадьевич" })
  @IsString()
  @MaxLength(1024)
  middleName: string;

  @ApiProperty({ example: "unique@gmail.com" })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: "strong-password" })
  @IsString()
  @MinLength(5)
  @MaxLength(40)
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    enum: DefaultRolesEnum,
  })
  @IsEnum(DefaultRolesEnum)
  @IsNotEmpty()
  role: DefaultRolesEnum;
}
