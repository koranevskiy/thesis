import { Detection, DetectionObject } from "src/shared/services/types/camera.type.ts";
import { makeAutoObservable, runInAction } from "mobx";
import CameraService from "src/shared/services/camera.service.ts";
import axios from "axios";

export class DetectionModel {
  detections: Detection[] = [];

  currentDetection: (Detection & { char_data?: DetectionObject[] }) | null = null;

  currentIndex: number | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  *getDetections(camera_id: number) {
    this.detections = yield CameraService.getDetections(camera_id);
    // if (this.detections.length) {
    //   this.currentIndex = 0;
    // }
    // this.currentDetection = this.detections[this.currentIndex ?? 0] ?? null;
  }

  async setCurrentDetection(detection: Detection | null) {
    if (!detection) {
      return runInAction(() => {
        this.currentDetection = detection;
      });
    }
    const conf_url = detection.detection_json_link.replace("http://nginx", import.meta.env.VITE_PROXY_URL);
    const { data } = await axios.get<DetectionObject[]>(conf_url);
    runInAction(() => {
      this.currentDetection = detection;
      this.currentDetection.char_data = data;
    });
  }
}
