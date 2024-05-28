export interface AuthJwtSignPayload {
  user_id: number;
}

export interface AuthJwtVerifyPayload {
  token: string;
}
