import { ApiExtraModels, ApiTags } from "@nestjs/swagger";
import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Next,
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
import { InspectionDto } from "src/domain/camera/dto/inspection.dto";

@ApiExtraModels(Camera, InspectionDto)
@ApiTags("Камеры")
@Controller("cameras")
export class CameraController {
  constructor(private readonly cameraService: CameraService) {}

  @ApiResponseCustom(HttpStatus.CREATED, Camera)
  @Post("/add-camera")
  @UseGuards(AuthGuard)
  async addCamera(@UserId() user_id: number, @Body() dto: AddCameraDto) {
    return this.cameraService.addCamera(user_id, dto);
  }

  @ApiResponseCustom(HttpStatus.OK, Camera, { isArray: true })
  @Get("/")
  @UseGuards(AuthGuard)
  async findCamera(@UserId() user_id: number) {
    return this.cameraService.findCamerasByUser(user_id);
  }

  @ApiResponseCustom(HttpStatus.OK, Camera)
  @Get("/:camera_id")
  @UseGuards(AuthGuard)
  async findCameraById(@UserId() user_id: number, @Param("camera_id", ParseIntPipe) camera_id: number) {
    return this.cameraService.findCameraById(user_id, camera_id);
  }

  @Post("/:camera_id/start-container")
  @UseGuards(AuthGuard)
  async startCamera(@UserId() user_id: number, @Param("camera_id", ParseIntPipe) camera_id: number) {
    return this.cameraService.startContainer(user_id, camera_id);
  }

  @Get("/minio/ui")
  async proxyMinioConsole(@Res() response: Response, @Req() request: Request, @Next() next: any) {
    response.status(HttpStatus.MOVED_PERMANENTLY);
    return proxy(`http://bntu-thesis-minio-1:9001/`, {
      proxyReqPathResolver: req => {
        console.log({ path: req.path });
        return req.path;
      },
    })(request, response, next);
  }

  @Get("/minio")
  async proxyMinioServer(@Res() response: Response, @Req() request: Request, @Next() next: any) {
    return proxy(`http://bntu-thesis-minio-1:9000`, {
      proxyReqPathResolver: req => {
        console.log({ path: req.path });
        return req.path;
      },
    })(request, response, next);
  }

  @Get("/:camera_id/inspect-video")
  @ApiResponseCustom(HttpStatus.OK, InspectionDto)
  @UseGuards(AuthGuard, CameraGuard)
  async inspectVideo(@Param("camera_id") camera_id: number, @CameraEntity() camera: Camera) {
    return this.cameraService.inspectVideo(camera);
  }

  @Post("/:camera_id/start-video")
  @ApiResponseCustom(HttpStatus.OK, InspectionDto)
  @UseGuards(AuthGuard, CameraGuard)
  async startVideo(@Param("camera_id") camera_id: number, @CameraEntity() camera: Camera) {
    return this.cameraService.startVideo(camera);
  }

  @Post("/:camera_id/stop-video")
  @ApiResponseCustom(HttpStatus.OK, InspectionDto)
  @UseGuards(AuthGuard, CameraGuard)
  async stopVideo(@Param("camera_id") camera_id: number, @CameraEntity() camera: Camera) {
    return this.cameraService.stopVideo(camera);
  }
}
