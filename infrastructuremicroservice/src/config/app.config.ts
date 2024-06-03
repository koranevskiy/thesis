import * as path from "node:path";
import { registerAs } from "@nestjs/config";

export interface AppConfig {
  app_port: number;
  rootVolumePath: string;
  minio_port: number;
  minio_console_port: number;
  minio_container_prefix: string;
  video_container_prefix: string;
  minio_main_container_name: string;
  network_name: string;
  minio_image_name: string;
  videomicroservice_image_name: string;
  bucket_name: string;
  minio_alias: string;
}

export default registerAs("app", () => ({
  app_port: 4000,
  rootVolumePath: path.resolve(process.cwd(), "..", "volumes"), // путь до volumes в руте репозитория, нужна для сохранения файлов из контейнеров
  minio_port: 9000,
  minio_console_port: 9001,
  minio_container_prefix: "minio",
  video_container_prefix: "video",
  network_name: "bntu-thesis_thesis",
  minio_image_name: "minio/minio:latest",
  videomicroservice_image_name: "videomicroservice:latest",
  bucket_name: "videos",
  minio_main_container_name: "bntu-thesis-minio-1",
  minio_alias: "myminio",
}));
