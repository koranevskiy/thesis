export interface CameraConfig {
  rtsp_link: string;
  minio_login: string;
  minio_password: string;
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

export interface CameraContainerInspection {
  Id: string;
  Created: string;
  Path: string;
  Args: string[];
  State: CameraContainerState;
}

export interface CameraContainerState {
  Status: string;
  Running: boolean;
  Paused: boolean;
  Restarting: boolean;
  OOMKilled: boolean;
  Dead: boolean;
  Pid: number;
  ExitCode: number;
  Error: string;
  StartedAt: string;
  FinishedAt: string;
}
