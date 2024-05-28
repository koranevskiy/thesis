import { User } from "src/shared/models/types/user.types.ts";

export interface AuthDto {
  email: string;
  password: string;
}

export interface TokensResponse {
  access_token: string;
  refresh_token: string;
}

export interface LoginResponse {
  user: User;
  tokens: TokensResponse;
}
