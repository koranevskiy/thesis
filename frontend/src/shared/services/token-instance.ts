import axios from 'axios'
import { ACCESS_TOKEN_KEY, API_URL, REFRESH_TOKEN_KEY } from 'src/shared/services/api.constant.ts'
import StorageService from 'src/shared/services/storage.service.ts'
import AuthService from 'src/shared/services/auth.service.ts'


const tokenInstance = axios.create({
  baseURL: API_URL,
})

tokenInstance.interceptors.request.use(
  (config) => {
    const newConfig = { ...config }
    const token = StorageService.get(ACCESS_TOKEN_KEY)
    if (token) {
      newConfig.headers.Authorization = `Bearer ${token}`
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
    console.log(err)
    if (err.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true
      try {
        const refreshToken = StorageService.get(REFRESH_TOKEN_KEY)
        const { data } = await AuthService.refresh(refreshToken!)
        StorageService.set(ACCESS_TOKEN_KEY, data.access_token)
        StorageService.set(REFRESH_TOKEN_KEY, data.refresh_token)
        return tokenInstance(originalConfig)
      } catch (_error) {
        return Promise.reject(_error)
      }
    }
    return Promise.reject(err)
  },
)

export { tokenInstance }