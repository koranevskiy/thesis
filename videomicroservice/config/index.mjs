import dotenv from "dotenv";

if (process.env.NODE_ENV === "local") {
  dotenv.config({
    path: `../.env.${process.env.NODE_ENV}`,
  });
}

class Config {
  constructor() {
    this.s3 = {
      login: process.env.S3_LOGIN,
      password: process.env.S3_PASS,
      url: process.env.S3_URL,
      Bucket: process.env.BUCKET_NAME,
    };
    this.loadVideo = {
      loadCronTime: process.env.VIDEO_UPLOAD_CRON_TIME,
    };
    this.rtspLink = process.env.RTSP_LINK;
    this.proxyUrl = process.env.PROXY_URL;
    this.cameraUuid = process.env.CAMERA_UUID;
  }
}

export default new Config();
