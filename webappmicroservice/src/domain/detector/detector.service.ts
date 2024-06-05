import { Injectable } from "@nestjs/common";
import { CameraService } from "src/domain/camera/camera.service";
import { AddEventDto } from "src/domain/detector/dto/add-event.dto";
import { S3Service } from "#system/s3/s3.service";
import { Detection } from "src/domain/detector/detector.entity";
import { Camera } from "src/domain/camera/camera.entity";

@Injectable()
export class DetectorService {
  constructor(
    private readonly cameraService: CameraService,
    private readonly s3Serivce: S3Service
  ) {}

  async findFrames() {}

  async addEvent(dto: AddEventDto) {
    let detection = new Detection();
    const camera = await this.cameraService.findCameraBuUuid(dto.camera_uuid);
    detection.camera_id = camera.camera_id;
    detection.event_text = dto.event_text;
    const [original_image_link, annotated_image_link] = await this.s3Serivce.putObjectsFile(
      [Buffer.from(dto.original_image, "base64"), Buffer.from(dto.annotated_image, "base64")],
      { imageBase64: true }
    );
    detection.original_image_link = original_image_link;
    detection.annotated_image_link = annotated_image_link;
    detection.detection_json_link = (
      await this.s3Serivce.putObjectsFile([Buffer.from(JSON.stringify(dto.detections))])
    )[0];
    detection = await detection.save();
    return detection;
  }

  async getDetectionList(camera_id: number) {
    const detections = await Detection.find({
      where: {
        camera_id,
      },
      order: {
        created_at: "desc",
      },
    });
    return detections;
  }
}
