import { Global, Module } from '@nestjs/common'
import { CustomLogger } from '#system/logger/logger'

@Global()
@Module({
  providers: [CustomLogger],
  exports: [CustomLogger]
})
export class LoggerModule{}