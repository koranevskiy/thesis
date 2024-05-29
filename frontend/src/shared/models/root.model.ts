import { makeAutoObservable } from "mobx";
import UserModel from "src/shared/models/user.model.ts";
import AuthModel from "src/shared/models/auth.model.ts";
import { CameraModel } from "src/shared/models/camera.model.ts";

class RootModel {
  readonly userModel: UserModel;

  readonly authModel: AuthModel;

  readonly cameraModel: CameraModel;
  constructor() {
    makeAutoObservable(this);
    this.authModel = new AuthModel(this);
    this.userModel = new UserModel(this);
    this.cameraModel = new CameraModel(this);
  }
}

export default new RootModel();

export { RootModel as Model };
