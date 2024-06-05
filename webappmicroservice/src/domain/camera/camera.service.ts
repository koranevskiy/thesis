import { HttpStatus, Injectable } from "@nestjs/common";
import { AddCameraDto } from "src/domain/camera/dto/add-camera.dto";
import { Camera, CameraConfig } from "src/domain/camera/camera.entity";
import { DomainException } from "#system/exceptions/domain.exception";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { S3Service } from "#system/s3/s3.service";
import { HttpService } from "@nestjs/axios";
import { UserService } from "src/domain/user/user.service";
import { DefaultRolesEnum } from "src/domain/auth/roles.enum";
import { ConfigService } from "@nestjs/config";
import { AppConfig } from "#config/app.config";

@Injectable()
export class CameraService {
  @InjectDataSource()
  private readonly dataSource: DataSource;

  constructor(
    private readonly s3Service: S3Service,
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    private readonly configService: ConfigService
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

  async findCamerasByUser(user_id: number) {
    let cameras = await Camera.find({
      where: {
        user_id,
      },
    });
    cameras = await Promise.all(
      cameras.map(async camera => {
        camera.config = await this.getCameraConfig(camera.file_config_link);
        return camera;
      })
    );
    return cameras;
  }

  private async getCameraConfig(file_config_link: string) {
    const { data } = await this.httpService.axiosRef.get<CameraConfig>(file_config_link);
    return data;
  }

  async findCameraBuUuid(uuid_name: string) {
    const camera = await Camera.findOne({
      where: {
        uuid_name,
      },
    });

    if (!camera) {
      throw new DomainException({
        code: HttpStatus.NOT_FOUND,
        message: `Камера по uuid = ${uuid_name} не найдена`,
      });
    }

    camera.config = await this.getCameraConfig(camera.file_config_link);
    return camera;
  }

  async findCameraById(user_id: number, camera_id: number) {
    const camera = await Camera.findOne({
      where: {
        camera_id,
      },
    });
    if (!camera) {
      throw new DomainException({
        code: HttpStatus.NOT_FOUND,
        message: `Камера по camera_id = ${camera_id} не найдена`,
      });
    }
    const user = await this.userService.findUserByIdOrEmail({ user_id });
    if (camera.user_id !== user_id && !user.roles.some(role => role.role_name === DefaultRolesEnum.Admin)) {
      throw new DomainException({ code: HttpStatus.FORBIDDEN, message: "Отказано в доступе к камере" });
    }
    camera.config = await this.getCameraConfig(camera.file_config_link);
    return camera;
  }

  async startContainer(user_id: number, camera_id: number) {
    const config = this.configService.get<AppConfig>("app");
    const camera = await this.findCameraById(user_id, camera_id);
    const { data } = await this.httpService.axiosRef.post(`${config.infrastructureApiLink}/create-video-containers`, {
      uuid_name: camera.uuid_name,
      video_container: {
        rtsp_link: camera.config.rtsp_link,
      },
      minio_container: {
        minio_login: camera.config.minio_login,
        minio_password: camera.config.minio_password,
      },
    });

    return data;
  }

  async inspectVideo(camera: Camera) {
    const config = this.configService.get<AppConfig>("app");

    const { data } = await this.httpService.axiosRef.get(
      `${config.infrastructureApiLink}/video-container/${camera.uuid_name}/inspect`
    );
    return data;
  }

  async startVideo(camera: Camera) {
    const config = this.configService.get<AppConfig>("app");

    const { data } = await this.httpService.axiosRef.post(
      `${config.infrastructureApiLink}/video-container/${camera.uuid_name}/start-video`
    );
    return data;
  }
  async stopVideo(camera: Camera) {
    const config = this.configService.get<AppConfig>("app");

    const { data } = await this.httpService.axiosRef.post(
      `${config.infrastructureApiLink}/video-container/${camera.uuid_name}/stop-video`
    );
    return data;
  }
}
