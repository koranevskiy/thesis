import { makeAutoObservable } from 'mobx'
import { User } from 'src/shared/models/types/user.types.ts'


class UserModel {

  user: User | null = null
  constructor() {
    makeAutoObservable(this)
  }

  setUser(user: User) {
    this.user = user
  }
}


export default new UserModel()