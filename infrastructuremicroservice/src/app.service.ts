import { Injectable } from "@nestjs/common";
import {
  CreateVideoContainersDto,
  MinioContainerEnvDto,
  VideoContainerEnvDto,
} from "src/dtos/create-video-containers.dto";
import * as child_process from "node:child_process";
import * as util from "node:util";
import { ConfigService } from "@nestjs/config";
import { AppConfig } from "src/config/app.config";
import * as path from "node:path";
import * as Dockerode from "dockerode";

const exec = util.promisify(child_process.exec);
const Docker = new Dockerode({ socketPath: "/var/run/docker.sock" });

@Injectable()
export class AppService {
  private readonly cfg: AppConfig;

  constructor(private readonly configService: ConfigService) {
    this.cfg = configService.get<AppConfig>("app");
  }

  async createVideoContainers(dto: CreateVideoContainersDto) {
    const resultObj = {} as Record<string, any>;
    try {
      await this.startMinioContainer(dto.uuid_name, dto.minio_container);
      resultObj.minio = { success: true };
    } catch (e) {
      console.error("minio", e);
      resultObj.minio = { success: false };
    }
    try {
      await this.startVideoContainer(dto);
      resultObj.video = { success: true };
    } catch (e) {
      console.error("video", e);
      resultObj.video = { success: false };
    }

    return resultObj;
  }

  async startMinioContainer(uuid_name: string, minio: MinioContainerEnvDto) {
    //const network_args = this.getNetworkString()

    /*const envs = this.getEnvsString(envs_obj)
    const ports = `-p :${this.cfg.minio_port} -p :${this.cfg.minio_console_port}`
    const name = `--name ${this.cfg.minio_container_prefix}-${uuid_name}`
    return exec(`docker run ${this.cfg.minio_image_name} -d ${network_args} ${envs} ${ports} ${name}`)
     */
    const name = `${this.cfg.minio_container_prefix}-${uuid_name}`;
    const volumeRootPath = this.cfg.rootVolumePath;
    const targetPath = path.join(volumeRootPath, name);
    const container = await Docker.createContainer({
      Image: this.cfg.minio_image_name,
      name,
      ExposedPorts: {
        [`${this.cfg.minio_port}/tcp`]: {
          // HostIp: '0.0.0.0',
          // HostPort: this.cfg.minio_port
        },
        [`${this.cfg.minio_console_port}/tcp`]: {
          // HostIp: '0.0.0.0',
          // HostPort: this.cfg.minio_console_port
        },
      },
      Env: [`MINIO_ROOT_USER=${minio.minio_login}`, `MINIO_ROOT_PASSWORD=${minio.minio_password}`],
      HostConfig: {
        NetworkMode: this.cfg.network_name,
        Binds: [`${targetPath}:/data`],
      },
      Cmd: ["server", "--console-address", `:${this.cfg.minio_console_port}`, "/data/"],
    });
    await container.start();

    return true;
  }

  async startVideoContainer(options: CreateVideoContainersDto) {
    const name = `${this.cfg.video_container_prefix}-${options.uuid_name}`;
    const container = await Docker.createContainer({
      Image: this.cfg.videomicroservice_image_name,
      name,
      Env: [
        `S3_LOGIN=${options.minio_container.minio_login}`,
        `S3_PASS=${options.minio_container.minio_password}`,
        `S3_URL=http://${name}:${this.cfg.minio_port}`,
        `BUCKET_NAME=${this.cfg.bucket_name}`,
        `RTSP_LINK=${options.video_container.rtsp_link}`,
      ],
      HostConfig: {
        NetworkMode: this.cfg.network_name,
      },
    });
    await container.start();
    return true;
  }

  private getEnvsString(envs: Record<string, string | number>) {
    const entries = Object.entries(envs);
    return entries.reduce((prev, [key, value]) => {
      return prev + ` -e ${key}='${value}'`;
    }, "");
  }

  private getNetworkString() {
    const network = this.cfg.network_name;
    return `--network=${network}`;
  }

  private getVolumeString(target: string, destination: string) {
    const volumeRootPath = this.cfg.rootVolumePath;
    const targetPath = path.join(volumeRootPath, target);
    return `-v ${targetPath}:${destination}`;
  }

  private getMinioVolumePath(uuid_name: string) {
    const minioVolumeTarget = `${this.cfg.minio_container_prefix}-${uuid_name}`;
    const destination = "/data";
    return this.getVolumeString(minioVolumeTarget, destination);
  }
}
