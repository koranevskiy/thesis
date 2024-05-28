import StorageService from "src/shared/services/storage.service.ts";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "src/shared/services/api.constant.ts";
import { TokensResponse } from "src/shared/services/types/auth.type.ts";

export default class TokenService {
  static getTokens() {
    const access_token = StorageService.get(ACCESS_TOKEN_KEY);
    const refresh_token = StorageService.get(REFRESH_TOKEN_KEY);
    return {
      access_token,
      refresh_token,
    };
  }

  static setTokens(dto: TokensResponse) {
    StorageService.set(ACCESS_TOKEN_KEY, dto.access_token);
    StorageService.set(REFRESH_TOKEN_KEY, dto.refresh_token);
  }

  static deleteTokens() {
    StorageService.delete(ACCESS_TOKEN_KEY);
    StorageService.delete(REFRESH_TOKEN_KEY);
  }
}
