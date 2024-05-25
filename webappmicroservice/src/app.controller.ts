import { Controller, Get, Req } from '@nestjs/common'
import { CustomLogger } from '#system/logger/logger'

@Controller()
export class AppController{
  constructor(private readonly logger: CustomLogger) {}

  @Get('/')
  async test(@Req() req: Request){
    this.logger.log(2123)
    throw new Error('123123123123')
    return {z: 'aue'}
  }
}