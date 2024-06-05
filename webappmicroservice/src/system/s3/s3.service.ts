import { Inject, Injectable } from "@nestjs/common";
import fs from "node:fs";
import { S3Config } from "#config/s3.config";
import * as AWS from "aws-sdk";
import * as moment from "moment";
import * as crypto from "node:crypto";
import { PutObjectRequest } from "aws-sdk/clients/s3";
@Injectable()
export class S3Service {
  private readonly s3: AWS.S3;

  private readonly config: S3Config;

  private readonly s3Url: string;

  private readonly bucketName: string;

  private lastActionDate: moment.Moment;

  constructor(options: { s3Config: S3Config; s3: AWS.S3 }) {
    this.s3 = options.s3;
    this.config = options.s3Config;
    this.s3Url = `${this.config.url}/`;
    this.bucketName = options.s3Config.Bucket;
    this.lastActionDate = moment();
  }

  private getObjectKey(folderName: string) {
    return folderName + crypto.randomUUID();
  }

  private getObjectUrl(objectKey: string, bucketName: string) {
    return `${this.s3Url}${bucketName}/${objectKey}`;
  }

  private getFolderName() {
    const isNeedUpdateFolder = moment().diff(this.lastActionDate, "day", true) >= 1;
    if (isNeedUpdateFolder) {
      this.lastActionDate = moment();
    }
    const folderName = this.lastActionDate.format("DD-MM-YYYY") + "/";
    return folderName;
  }

  async putObjectsFile(
    objects: { path: string }[] | Buffer[],
    options: { imageBase64?: boolean } = {}
  ): Promise<string[]> {
    const folderName = this.getFolderName();
    const bucketName = this.bucketName;
    let bufferObjects;

    if (!Buffer.isBuffer(objects[0])) {
      bufferObjects = await Promise.all(
        objects.map(object => {
          return new Promise((res, rej) => {
            fs.readFile(object.path, (err, data) => {
              if (err) {
                rej(err);
                return;
              }
              res({ buffer: data });
            });
          });
        })
      );
    } else {
      bufferObjects = objects.map(buffer => ({
        buffer,
      }));
    }

    const uploadPromeses = bufferObjects.map(object => {
      const objectKey = this.getObjectKey(folderName);
      const objectPayload: PutObjectRequest = {
        Key: objectKey,
        Body: object.buffer,
        Bucket: bucketName,
        ACL: "public-read",
      };
      if (options.imageBase64) {
        objectPayload.ContentEncoding = "base64";
        objectPayload.ContentType = "image/jpeg";
      }
      return this.s3
        .putObject(objectPayload)
        .promise()
        .then(() => this.getObjectUrl(objectKey, bucketName));
    });

    return Promise.all(uploadPromeses);
  }

  static async createBucket(s3Config: S3Config): Promise<{ s3: AWS.S3; s3Config: S3Config }> {
    const s3 = new AWS.S3({
      credentials: {
        accessKeyId: s3Config.login,
        secretAccessKey: s3Config.password,
      },
      endpoint: s3Config.url,
      // region: s3Config.region,
      s3ForcePathStyle: true,
      sslEnabled: s3Config.ssl === "true",
    });
    const resolveOptions = {
      s3,
      s3Config,
    };
    const bucketName = s3Config.Bucket;
    return new Promise((resolve, reject) => {
      s3.headBucket({ Bucket: bucketName }, (err, data) => {
        if (!err) {
          resolve(resolveOptions);
          return;
        }
        if (!err) {
          resolve(resolveOptions);
          return;
        }
        if (err.code === "NotFound" || err.code === "ENOTFOUND") {
          s3.createBucket({ Bucket: bucketName, ACL: "public-read-write" }, (err, data) => {
            if (err) {
              reject(err);
              return;
            }

            s3.putBucketPolicy({
              Bucket: bucketName,
              Policy: JSON.stringify({
                Version: "2012-10-17",
                Statement: [
                  {
                    Sid: "PublicAccess",
                    Effect: "Allow",
                    Principal: "*",
                    Action: "s3:*",
                    Resource: [`arn:aws:s3:::${bucketName}/*`],
                  },
                ],
              }),
            })
              .promise()
              .then(() => resolve(resolveOptions))
              .catch(reject);
          });
        } else {
          reject(err);
        }
      });
    });
  }

  // async recreateBucketIfNeed() {
  //   if (!this.config.RECREATE_BUCKET_CRON_TIME) return;
  //   scheduler.scheduleJob(this.config.RECREATE_BUCKET_CRON_TIME, async () => {
  //     this.bucketName = await this.createBucket(this.config.Bucket + moment().format("DD-MM-YYYY-HH-mm"));
  //   });
  // }
}
