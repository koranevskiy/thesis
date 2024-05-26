import { makeAutoObservable, runInAction } from 'mobx'
import { AuthDto, LoginResponse } from 'src/shared/services/types/auth.type.ts'
import AuthService from 'src/shared/services/auth.service.ts'
import { ApiResponse } from 'src/shared/services/types/response.type.ts'
import UserModel from 'src/shared/models/user.model.ts'
import StorageService from 'src/shared/services/storage.service.ts'
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from 'src/shared/services/api.constant.ts'


class AuthModel {

  isAuth: boolean = false
  constructor() {
    makeAutoObservable(this)
  }

  async login(dto: AuthDto) {
    const {data: {user, tokens}}: ApiResponse<LoginResponse> = await AuthService.login(dto)
    StorageService.set(ACCESS_TOKEN_KEY, tokens.access_token)
    StorageService.set(REFRESH_TOKEN_KEY, tokens.refresh_token)
    runInAction(() => {
      UserModel.setUser(user)
      this.isAuth = true
    })
    return user
  }

}


export default new AuthModel()