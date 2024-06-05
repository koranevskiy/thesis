import { DataSource } from "typeorm";
import { config } from "dotenv";
import { resolve } from "path";
import { DatabaseConfig } from "#config/database.config";

config({ path: resolve(__dirname, "..", "..", "..", `.env.${process.env.NODE_ENV}`) });

const isLocal = process.env.NODE_ENV === "local";

const dbCfg: DatabaseConfig = {
  type: "postgres",
  host: isLocal ? "localhost" : process.env.DATABASE_HOST,
  port: isLocal ? 6000 : Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  migrations: ["dist/migrations/*{.ts,.js}"],
  synchronize: false,
  entities: ["dist/**/*.entity.{ts,js}"],
};

const dataSource = new DataSource(dbCfg);

export { dataSource };
