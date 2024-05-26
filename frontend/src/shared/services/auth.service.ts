import { API_URL } from 'src/shared/services/api.constant.ts'
import { AuthDto, LoginResponse } from 'src/shared/services/types/auth.type.ts'
import axios from 'axios'
import { ApiResponse } from 'src/shared/services/types/response.type.ts'


class AuthService {
   private baseUrl = `${API_URL}/auth`

  async login(dto: AuthDto) {
    const response = await axios.post<ApiResponse<LoginResponse>>(`${this.baseUrl}/login`, dto)
    return response.data
  }
}


export default new AuthService()