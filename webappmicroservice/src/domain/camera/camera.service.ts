import { HttpStatus, Injectable } from "@nestjs/common";
import { AddCameraDto } from "src/domain/camera/dto/add-camera.dto";
import { Camera, CameraConfig } from "src/domain/camera/camera.entity";
import { DomainException } from "#system/exceptions/domain.exception";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { S3Service } from "#system/s3/s3.service";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class CameraService {
  @InjectDataSource()
  private readonly dataSource: DataSource;

  constructor(
    private readonly s3Service: S3Service,
    private readonly httpService: HttpService
  ) {}
  async addCamera(user_id: number, dto: AddCameraDto) {
    const cameras = await Camera.find({
      where: {
        user_id,
        camera_name: dto.camera_name,
      },
    });
    if (cameras.length) {
      throw new DomainException({
        code: HttpStatus.BAD_REQUEST,
        message: `У пользователя существует камера с именем ${dto.camera_name}`,
      });
    }

    const [link] = await this.s3Service.putObjectsFile([Buffer.from(JSON.stringify(dto.config))]);
    let camera = new Camera();
    camera.user_id = user_id;
    camera.camera_name = dto.camera_name;
    camera.file_config_link = link;
    camera = await camera.save();
    const { data } = await this.httpService.axiosRef.get<CameraConfig>(link);
    camera.config = data;
    return camera;
  }
}
