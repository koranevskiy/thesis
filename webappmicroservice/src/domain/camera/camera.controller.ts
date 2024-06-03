import { ApiExtraModels, ApiTags } from "@nestjs/swagger";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/domain/auth/guards/auth.guard";
import { CameraService } from "src/domain/camera/camera.service";
import { UserId } from "#system/decorators/user-id.decorator";
import { AddCameraDto } from "src/domain/camera/dto/add-camera.dto";
import { ApiResponseCustom } from "#system/decorators/swagger-response.decorator";
import { Camera } from "src/domain/camera/camera.entity";
import { CameraGuard } from "src/domain/camera/guards/camera.guard";
import { CameraEntity } from "src/domain/camera/decorators/camera.decorator";
import { Response, Request } from "express";
import * as proxy from "express-http-proxy";

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

  @ApiResponseCustom(HttpStatus.OK, Camera, { isArray: true })
  @Get("/")
  async findCamera(@UserId() user_id: number) {
    return this.cameraService.findCamerasByUser(user_id);
  }

  @ApiResponseCustom(HttpStatus.OK, Camera)
  @Get("/:camera_id")
  async findCameraById(@UserId() user_id: number, @Param("camera_id", ParseIntPipe) camera_id: number) {
    return this.cameraService.findCameraById(user_id, camera_id);
  }

  @Post("/:camera_id/start-container")
  async startCamera(@UserId() user_id: number, @Param("camera_id", ParseIntPipe) camera_id: number) {
    return this.cameraService.startContainer(user_id, camera_id);
  }

  @Get("/:camera_id/redirect-minio-console")
  @UseGuards(CameraGuard)
  @HttpCode(HttpStatus.MOVED_PERMANENTLY)
  async redirectToMinio(
    @Param("camera_id", ParseIntPipe) camera_id: number,
    @CameraEntity() camera: Camera,
    @Res() response: Response,
    @Req() request: Request
  ) {
    // response.status(HttpStatus.MOVED_PERMANENTLY)
    return proxy(`http://minio-${camera.uuid_name}:9001`, {
      proxyReqPathResolver: req => {
        return `/browser`;
      },
    })(request, response, null);
  }
}
