import { flowResult, makeAutoObservable } from "mobx";
import { User } from "src/shared/models/types/user.types.ts";
import UserService from "src/shared/services/user.service.ts";
import StorageService from "src/shared/services/storage.service.ts";
import { ACCESS_TOKEN_KEY } from "src/shared/services/api.constant.ts";
import ErrorModel from "src/shared/models/error.model.ts";
import { Model } from "src/shared/models/root.model.ts";

class UserModel {
  user: User | null = null;

  isUserLoading = false;

  constructor(private readonly root: Model) {
    makeAutoObservable(this);
    const accessToken = StorageService.get(ACCESS_TOKEN_KEY);
    if (accessToken) {
      flowResult(this.getUser());
    }
  }

  setUser(user: User) {
    this.user = user;
  }

  *getUser() {
    this.user = null;
    this.isUserLoading = true;
    try {
      const user: User = yield UserService.getUser();
      this.setUser(user);
      this.root.authModel.setIsAuth(true);
      return user;
    } catch (e: any) {
      ErrorModel.errorOccured(e?.response?.data?.message || e?.message || "");
    } finally {
      this.isUserLoading = false;
    }
  }
}

export default UserModel;
