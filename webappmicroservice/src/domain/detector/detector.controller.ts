import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiExtraModels, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/domain/auth/guards/auth.guard";
import { CameraGuard } from "src/domain/camera/guards/camera.guard";
import { AddEventDto } from "src/domain/detector/dto/add-event.dto";
import { DetectorService } from "src/domain/detector/detector.service";
import { ApiResponseCustom } from "#system/decorators/swagger-response.decorator";
import { Detection } from "src/domain/detector/detector.entity";
import { CameraEntity } from "src/domain/camera/decorators/camera.decorator";
import { Camera } from "src/domain/camera/camera.entity";

@Controller("detectors")
@ApiTags("Детекторы")
@ApiExtraModels(Detection)
export class DetectorController {
  constructor(private readonly detectorService: DetectorService) {}

  @Get(":camera_id")
  @UseGuards(AuthGuard, CameraGuard)
  @ApiResponseCustom(200, Detection, { isArray: true })
  async getDetectionList(@CameraEntity() camera: Camera) {
    return this.detectorService.getDetectionList(camera.camera_id);
  }

  @Post("/event")
  @ApiResponseCustom(201, Detection)
  async addEvent(@Body() dto: AddEventDto) {
    return this.detectorService.addEvent(dto);
  }
}
