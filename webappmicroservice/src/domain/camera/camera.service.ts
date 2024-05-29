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
}
