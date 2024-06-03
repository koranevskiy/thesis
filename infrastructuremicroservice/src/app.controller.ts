import { Body, Controller, Get, HttpStatus, Param, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateVideoContainersDto } from "src/dtos/create-video-containers.dto";
import { InspectionDto } from "src/dtos/inspection.dto";

@Controller()
@ApiTags("АПИ для контейнеров")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("/create-video-containers")
  async createVideoContainers(@Body() dto: CreateVideoContainersDto) {
    return this.appService.createVideoContainers(dto);
  }

  @ApiResponse({ type: InspectionDto, status: HttpStatus.OK })
  @Get("video-container/:uuid_name/inspect")
  async inspectVideo(@Param("uuid_name") uuid_name: string) {
    return this.appService.inspectVideo(uuid_name);
  }

  @Post("video-container/:uuid_name/start-video")
  async startVideo(@Param("uuid_name") uuid_name: string) {
    return this.appService.startVideo(uuid_name);
  }

  @Post("video-container/:uuid_name/stop-video")
  async stopVideo(@Param("uuid_name") uuid_name: string) {
    return this.appService.stopVideo(uuid_name);
  }
}
