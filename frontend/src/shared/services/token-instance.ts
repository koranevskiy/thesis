import axios from 'axios'
import { API_URL } from 'src/shared/services/api.constant.ts'
import AuthService from 'src/shared/services/auth.service.ts'
import { AppRoutesEnum } from 'src/shared/router/app-routes.enum.ts'
import AuthModel from 'src/shared/models/auth.model.ts'
import TokenService from 'src/shared/services/token.service.ts'


const tokenInstance = axios.create({
  baseURL: API_URL,
})

tokenInstance.interceptors.request.use(
  (config) => {
    const newConfig = { ...config }
    const token = TokenService.getTokens()
    if (token) {
      newConfig.headers.Authorization = `Bearer ${token.access_token}`
    } else {
      throw new axios.Cancel('Не авторизован')
    }
    return newConfig
  },
  (error) => Promise.reject(error),
)

tokenInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (!err.config) {
      return Promise.reject(err)
    }
    const originalConfig = err.config
    if (err.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true
      try {
        const {refresh_token} = TokenService.getTokens()
        const { data } = await AuthService.refresh(refresh_token!)
        TokenService.setTokens(data)
        return tokenInstance(originalConfig)
      } catch (_error: any) {
        if(_error?.response?.data?.message === 'Рефрешь токен истек') {
          TokenService.deleteTokens()
          AuthModel.setIsAuth(false)
          window.location.pathname = AppRoutesEnum.Login
        }
        return Promise.reject(_error)
      }
    }
    return Promise.reject(err)
  },
)

export { tokenInstance }