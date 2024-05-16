import { registerAs } from '@nestjs/config'


export interface DatabaseConfig{
  type: 'postgres'
  host: string
  port: number
  username: string
  password: string
  database: string
  migrations: Array<string>
  synchronize: boolean
  entities: Array<string>
}

export const databaseConfig = registerAs('database', () => ({
  type: 'postgres' as const,
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  migrations: ["dist/migrations/*{.ts,.js}"],
  synchronize: false,
  entities: ['**/*.entity.{ts,js}'],
}))