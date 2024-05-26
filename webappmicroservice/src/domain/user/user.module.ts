import { Module } from '@nestjs/common'
import { UserService } from 'src/domain/user/user.service'
import { UserController } from 'src/domain/user/user.controller'


@Module({
  imports: [],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}