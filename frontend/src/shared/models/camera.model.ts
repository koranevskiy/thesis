import { Model } from "src/shared/models/root.model.ts";
import { makeAutoObservable } from "mobx";
import { Camera, CameraDto } from "src/shared/services/types/camera.type.ts";
import CameraService from "src/shared/services/camera.service.ts";

export class CameraModel {
  cameras: Camera[] = [];

  currentCamera: Camera | null = null;

  constructor(private readonly root: Model) {
    makeAutoObservable(this);
  }

  *getCameras() {
    this.cameras = yield CameraService.getCameras();
    return this.cameras;
  }

  *addCamera(dto: CameraDto) {
    const data: Camera = yield CameraService.addCamera(dto);
    // this.setCurrentCamera(data)
    return data;
  }

  *getCameraById(camera_id: number) {
    const camera: Camera = yield CameraService.getCamera(camera_id);
    return camera;
  }

  *startCameraContainers(camera_id: number) {
    const result: Record<string, any> = yield CameraService.startCameraContainers(camera_id);
    return result;
  }

  setCurrentCamera(camera: Camera | null) {
    this.currentCamera = camera;
  }

  setCameras(cameras: Camera[]) {
    this.cameras = cameras;
  }
}
