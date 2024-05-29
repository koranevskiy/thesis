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
import * as child_process from "node:child_process";

@Injectable()
export class CameraService {
  @InjectDataSource()
  private readonly dataSource: DataSource;

  constructor(
    private readonly s3Service: S3Service,
    private readonly httpService: HttpService,
    private readonly userService: UserService
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
    const camera = await this.findCameraById(user_id, camera_id);
    const camera_uuid = camera.uuid_name;
    const minio_name = `minio${camera_uuid}`;
    const video_name = `video${camera_uuid}`;
    const minio_port = 9000;

    const network = "thesis";
    const minio_env = {
      MINIO_ROOT_USER: "admin",
      MINIO_ROOT_PASSWORD: "admin123",
    };
    const minio_env_str = Object.entries(minio_env).reduce((prev, [key, value]) => {
      return prev + ` -e ${key}='${value}'`;
    }, "");
    await new Promise((resolve, reject) => {
      child_process.exec(
        `docker run minio/minio:latest -d --network ${network} -p :9000 -p :9001 ${minio_env_str} --name ${minio_name}`,
        err => {
          if (err) {
            reject(err);
            return;
          }
          resolve(true);
        }
      );
    });
    const video_envs = {
      S3_LOGIN: "admin",
      S3_PASS: "admin123",
      S3_URL: `http://${minio_name}:${minio_port}`,
      BUCKET_NAME: "videos",
      RTSP_LINK: camera.config.rtsp_link,
    };
    const video_env_str = Object.entries(video_envs).reduce((prev, [key, value]) => {
      return prev + ` -e ${key}='${value}'`;
    }, "");
    await new Promise((resolve, reject) => {
      child_process.exec(
        `docker run videomicroservice:latest -d --network ${network} ${video_env_str} --name ${video_name}`,
        err => {
          if (err) {
            reject(err);
            return;
          }
          resolve(true);
        }
      );
    });
    return true;
  }
}
