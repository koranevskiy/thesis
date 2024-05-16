import { registerAs } from '@nestjs/config'


export interface AppConfig {
  apiPort: number
}

export const appConfig = registerAs('app', () => ({
  apiPort: Number(process.env.API_LISTENED_PORT),
}))