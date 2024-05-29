import { Module } from "@nestjs/common";
import { CameraService } from "src/domain/camera/camera.service";
import { CameraController } from "src/domain/camera/camera.controller";
import { S3Module } from "#system/s3/s3.module";
import { S3Service } from "#system/s3/s3.service";
import { HttpModule } from "@nestjs/axios";
import { UserModule } from "src/domain/user/user.module";

@Module({
  imports: [S3Module, HttpModule, UserModule],
  providers: [CameraService],
  controllers: [CameraController],
})
export class CameraModule {}
