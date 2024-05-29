import { tokenInstance } from "src/shared/services/token-instance.ts";
import { ApiResponse } from "src/shared/services/types/response.type.ts";
import { Camera, CameraDto } from "src/shared/services/types/camera.type.ts";

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
}

export default new CameraService();
