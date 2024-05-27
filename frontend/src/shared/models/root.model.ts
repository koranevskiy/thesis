import { makeAutoObservable } from 'mobx'
import UserModel from 'src/shared/models/user.model.ts'
import AuthModel from 'src/shared/models/auth.model.ts'


class RootModel {

  readonly userModel: UserModel

  readonly authModel: AuthModel
  constructor() {
    makeAutoObservable(this)
    this.authModel = new AuthModel(this)
    this.userModel = new UserModel(this)
  }
}

export default new RootModel()

export {RootModel as Model}