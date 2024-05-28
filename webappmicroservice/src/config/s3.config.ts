import { registerAs } from "@nestjs/config";

export interface S3Config {
  login: string;
  password: string;
  url: string;
  Bucket: string;
  region?: string;
  ssl: string;
}

export const s3Config = registerAs("s3", () => ({
  login: process.env.S3_LOGIN,
  password: process.env.S3_PASS,
  url: process.env.S3_URL,
  Bucket: process.env.BUCKET_NAME,
  ssl: process.env.S3_SSL || "false",
  region: process.env.S3_REGION || "localhost",
}));
