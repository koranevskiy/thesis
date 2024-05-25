import { registerAs } from '@nestjs/config'


export interface AppConfig {
  apiPort: number
  loggerTransport: 'console' | 'elastic'
  elasticNode: string
  elasticIndex: string
  logLevel: string
  accessTokenExpireTime: string
  jwtSecretKey: string
}

export const appConfig = registerAs('app', () => ({
  apiPort: Number(process.env.API_LISTENED_PORT),
  loggerTransport: 'console',
  elasticNode: process.env.ELASTIC_NODE,
  elasticIndex: process.env.ELASTIC_INDEX,
  logLevel: process.env.LOG_LEVEL,
  accessTokenExpireTime: process.env.ACCESS_TOKEN_EXPIRE_TIME,
  jwtSecretKey: process.env.JWT_SECRET_KEY
}))