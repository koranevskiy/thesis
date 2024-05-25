import { Body, Controller, Get, Post, Req } from '@nestjs/common'
import { CustomLogger } from '#system/logger/logger'
import { AuthJwtService } from '#system/auth/auth-jwt.service'
import { AuthJwtVerifyPayload } from '#system/auth/auth-jwt.types'
import { IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

class NestedTestDto{

  @ApiProperty()
  @IsString()
  test: string


  @ApiProperty()
  @IsString()
  test2: string

  @ApiProperty()
  @ValidateNested()
  @Type(() => NestedTestDto)
  @IsNotEmpty()
  child: NestedTestDto
}

class TestDto{
  @ApiProperty()
  @IsString()
  test: string




  @ApiProperty()
  @ValidateNested()
  @Type(() => NestedTestDto)
  @IsNotEmpty()
  nested: NestedTestDto
}

@Controller()
export class AppController{
  constructor(private readonly logger: CustomLogger, private readonly authJwtService: AuthJwtService) {}

  @Get('/')
  async test(@Req() req: Request){
    this.logger.log(2123)
    throw new Error('123123123123')
    return {z: 'aue'}
  }

  @Post()
  async testToken(@Body() dto: TestDto){
    return this.authJwtService.sign({user_id: -2})
  }

  @Post('/verify')
  async verifyToken(@Body() tokenPayload: AuthJwtVerifyPayload){
    return this.authJwtService.verify(tokenPayload)
  }
}