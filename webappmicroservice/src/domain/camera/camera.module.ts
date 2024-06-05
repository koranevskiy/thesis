import { Module } from "@nestjs/common";
import { CameraService } from "src/domain/camera/camera.service";
import { CameraController } from "src/domain/camera/camera.controller";
import { S3Module } from "#system/s3/s3.module";
import { HttpModule } from "@nestjs/axios";
import { UserModule } from "src/domain/user/user.module";
import { CameraGuard } from "src/domain/camera/guards/camera.guard";

@Module({
  imports: [S3Module, HttpModule, UserModule],
  providers: [CameraService, CameraGuard],
  controllers: [CameraController],
  exports: [CameraGuard, CameraService],
})
export class CameraModule {}
