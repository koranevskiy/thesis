import { makeAutoObservable } from "mobx";
import { AuthDto, LoginResponse } from "src/shared/services/types/auth.type.ts";
import AuthService from "src/shared/services/auth.service.ts";
import { ApiResponse } from "src/shared/services/types/response.type.ts";
import UserModel from "src/shared/models/user.model.ts";

import TokenService from "src/shared/services/token.service.ts";
import { Model } from "src/shared/models/root.model.ts";

class AuthModel {
  isAuth: boolean = false;

  constructor(private readonly root: Model) {
    makeAutoObservable(this);
  }

  *login(dto: AuthDto) {
    const {
      data: { user, tokens },
    }: ApiResponse<LoginResponse> = yield AuthService.login(dto);
    TokenService.setTokens(tokens);
    this.root.userModel.setUser(user);
    this.setIsAuth(true);
    return user;
  }

  *logout() {
    yield AuthService.logout();
    TokenService.deleteTokens();
    this.setIsAuth(false);
  }

  setIsAuth(value: boolean) {
    this.isAuth = value;
  }
}

export default AuthModel;
