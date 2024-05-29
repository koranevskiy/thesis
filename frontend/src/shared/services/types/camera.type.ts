export interface CameraConfig {
  rtsp_link: string;
}

export interface CameraDto {
  camera_name: string;
  config: CameraConfig;
}

export interface Camera {
  config: CameraConfig;
  camera_id: number;
  camera_name: string;
  uuid_name: string;
  file_config_link: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}
