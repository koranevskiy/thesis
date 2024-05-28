import { API_URL } from "src/shared/services/api.constant.ts";
import { AuthDto, LoginResponse, TokensResponse } from "src/shared/services/types/auth.type.ts";
import axios from "axios";
import { ApiResponse } from "src/shared/services/types/response.type.ts";
import { tokenInstance } from "src/shared/services/token-instance.ts";

class AuthService {
  private baseUrl = `${API_URL}/auth`;

  async login(dto: AuthDto) {
    const response = await axios.post<ApiResponse<LoginResponse>>(`${this.baseUrl}/login`, dto);
    return response.data;
  }

  async logout() {
    await tokenInstance.post("/auth/logout");
  }

  async refresh(refresh_token: string) {
    const response = await axios.post<ApiResponse<TokensResponse>>(`${this.baseUrl}/refresh`, {
      refresh_token,
    });
    return response.data;
  }
}

export default new AuthService();
