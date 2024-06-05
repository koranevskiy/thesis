import { tokenInstance } from "src/shared/services/token-instance.ts";
import { ApiResponse } from "src/shared/services/types/response.type.ts";
import { Camera, CameraContainerInspection, CameraDto, Detection } from "src/shared/services/types/camera.type.ts";

class CameraService {
  async addCamera(dto: CameraDto) {
    const { data } = await tokenInstance.post<ApiResponse<Camera>>("/cameras/add-camera", dto);
    return data.data;
  }

  async getCameras() {
    const { data } = await tokenInstance.get<ApiResponse<Camera[]>>("/cameras");
    return data.data;
  }

  async getCamera(camera_id: number) {
    const { data } = await tokenInstance.get<ApiResponse<Camera>>(`/cameras/${camera_id}`);
    return data.data;
  }

  async startCameraContainers(camera_id: number) {
    const { data } = await tokenInstance.post<ApiResponse<Record<string, any>>>(
      `/cameras/${camera_id}/start-container`
    );
    return data.data;
  }

  async redirectToMinioConsole(camera_id: number) {
    const { data } = await tokenInstance.get(`/cameras/${camera_id}/minio`);
  }
  async getMinioPage(uuid_name: string) {
    const { data } = await tokenInstance.get(`/:uuid_name/minio`);
  }

  async inspectVideo(camera_id: number) {
    const { data } = await tokenInstance.get<ApiResponse<CameraContainerInspection>>(
      `/cameras/${camera_id}/inspect-video`
    );
    return data.data;
  }

  async startVideo(camera_id: number) {
    const { data } = await tokenInstance.post<ApiResponse<boolean>>(`/cameras/${camera_id}/start-video`);
    return data.data;
  }

  async stopVideo(camera_id: number) {
    const { data } = await tokenInstance.post<ApiResponse<boolean>>(`/cameras/${camera_id}/stop-video`);
    return data.data;
  }

  async getDetections(camera_id: number) {
    const { data } = await tokenInstance.get<ApiResponse<Detection>>(`/detectors/${camera_id}`);
    return data.data;
  }
}

export default new CameraService();
