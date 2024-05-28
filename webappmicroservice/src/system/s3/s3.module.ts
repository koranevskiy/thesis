import { Module } from "@nestjs/common";
import { S3Service } from "#system/s3/s3.service";
import { ConfigService } from "@nestjs/config";
import { S3Config } from "#config/s3.config";

@Module({
  providers: [
    {
      provide: S3Service,
      useFactory: async (configService: ConfigService) => {
        const config = configService.get<S3Config>("s3");
        const options = await S3Service.createBucket(config);
        return new S3Service(options);
      },
      inject: [ConfigService],
    },
  ],
  exports: [S3Service],
})
export class S3Module {}
