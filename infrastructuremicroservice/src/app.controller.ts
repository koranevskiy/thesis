import { Body, Controller, Get, Post } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiTags } from "@nestjs/swagger";
import { CreateVideoContainersDto } from "src/dtos/create-video-containers.dto";

@Controller()
@ApiTags("АПИ для контейнеров")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("/create-video-containers")
  async createVideoContainers(@Body() dto: CreateVideoContainersDto) {
    return this.appService.createVideoContainers(dto);
  }
}
