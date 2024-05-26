import { makeAutoObservable } from 'mobx'

class ErrorModel {

  message = ''

  isOpen = false

  responseErrorMessage? = ''
  constructor() {
    makeAutoObservable(this)
  }

  errorOccured(message: string, responseErrorMessage?: string) {
    this.responseErrorMessage = responseErrorMessage
    this.message = message
    this.isOpen = true
  }

  closeModal() {
    this.isOpen = false
    this.responseErrorMessage = ''
    this.message = ''
  }

}


export default new ErrorModel()