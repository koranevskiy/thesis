import { Module } from "@nestjs/common";
import { DetectorController } from "src/domain/detector/detector.controller";
import { CameraModule } from "src/domain/camera/camera.module";
import { DetectorService } from "src/domain/detector/detector.service";
import { S3Module } from "#system/s3/s3.module";

@Module({
  imports: [CameraModule, S3Module],
  providers: [DetectorService],
  controllers: [DetectorController],
})
export class DetectorModule {}
