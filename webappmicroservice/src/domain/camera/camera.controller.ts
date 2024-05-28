import { ApiExtraModels, ApiTags } from "@nestjs/swagger";
import { Body, Controller, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/domain/auth/guards/auth.guard";
import { CameraService } from "src/domain/camera/camera.service";
import { UserId } from "#system/decorators/user-id.decorator";
import { AddCameraDto } from "src/domain/camera/dto/add-camera.dto";
import { ApiResponseCustom } from "#system/decorators/swagger-response.decorator";
import { Camera } from "src/domain/camera/camera.entity";

@ApiExtraModels(Camera)
@ApiTags("Камеры")
@Controller("cameras")
@UseGuards(AuthGuard)
export class CameraController {
  constructor(private readonly cameraService: CameraService) {}

  @ApiResponseCustom(HttpStatus.CREATED, Camera)
  @Post("/add-camera")
  async addCamera(@UserId() user_id: number, @Body() dto: AddCameraDto) {
    return this.cameraService.addCamera(user_id, dto);
  }
}
