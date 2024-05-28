import { Module } from "@nestjs/common";
import { UserService } from "src/domain/user/user.service";
import { UserController } from "src/domain/user/user.controller";
import { AuthJwtModule } from "#system/auth/auth-jwt.module";

@Module({
  imports: [AuthJwtModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
