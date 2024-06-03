import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { CameraService } from "src/domain/camera/camera.service";

@Injectable()
export class CameraGuard implements CanActivate {
  constructor(private readonly cameraService: CameraService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user_id = +request.headers["user_id"];
    const camera_id = +request.params.camera_id;
    request.camera = await this.cameraService.findCameraById(user_id, camera_id);
    return true;
  }
}
