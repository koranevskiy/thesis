import moment from 'moment'
import fs from 'node:fs'
import AWS from 'aws-sdk'

function extractFileFromBase64(base64File) {
  const mimeType = base64File.match(/^data:(.*\/.*);/);
  return [mimeType && mimeType[1], Buffer.from(base64File.replace(/^data:image\/\w+;base64,/, ""), "base64")];
}

class S3Lib {
  getObjectUrl(objectKey, bucketName) {
    return `${this.s3Url}${bucketName}/${objectKey}`;
  }

  getFolderName(object) {
    const fileName = object.path
    let [fileDate] = fileName.match(/\d{4}-\d{2}-\d{2}-T-\d{2}-\d{2}-\d{2}/gi) || []
    if(!fileDate) {
      throw { message: 'Invalid file name for s3 upload' }
    }
    const [year, month, dat, hour, minute, second] = fileDate.split('-').filter(item => item !== 'T')
    const folderName = `${year}/${month}/${dat}`
    const s3ObjectKey = `${hour}-${minute}-${second}.mp4`
    return {
      folderName,
      s3ObjectKey
    }
  }

  async putObjectsFile(objects) {
    const self = this
    const bucketName = self.bucketName;
    const bufferObjects = await Promise.all(
      objects.map(object => {
        return new Promise((res, rej) => {
          fs.readFile(object.path, (err, data) => {
            if (err) {
              rej(err);
              return;
            }
            res({ buffer: data, path: object.path });
          });
        });
      })
    );
    const uploadPromeses = bufferObjects.map(object => {
      const {folderName, s3ObjectKey} = self.getFolderName(object);
      const objectKey = `${folderName}/${s3ObjectKey}`
      const objectPayload = {
        Key: objectKey,
        Body: object.buffer,
        // ContentType: object.type,
        Bucket: bucketName,
        ACL: "public-read",
      };
      return self.s3
        .putObject(objectPayload)
        .promise()
        .then(() => self.getObjectUrl(objectKey, bucketName));
    });

    return Promise.all(uploadPromeses);
  }

  async createBucket(bucketName) {
    const self = this
    return new Promise((resolve, reject) => {
      self.s3.headBucket({ Bucket: bucketName }, (err, data) => {
        if (!err) {
          resolve(bucketName);
          return;
        }
        if (!err) {
          resolve(bucketName);
          return;
        }
        if (err.code === "NotFound" || err.code === "ENOTFOUND") {
          self.s3.createBucket({ Bucket: bucketName, ACL: "public-read-write" }, (err, data) => {
            if (err) {
              reject(err);
              return;
            }

            self.s3
              .putBucketPolicy({
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
              .then(() => resolve(bucketName))
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

  async initS3(s3Config) {
    this.s3 = new AWS.S3({
      credentials: {
        accessKeyId: s3Config.login,
        secretAccessKey: s3Config.password,
      },

      endpoint: s3Config.url,
      region: s3Config.region || "localhost",
      s3ForcePathStyle: true,
      sslEnabled: s3Config.ssl === "true",
    });
    this.lastActionDate = moment();
    this.config = s3Config;
    this.s3Url = `${s3Config.url}/`;
    // выносим в отдельное поля, в дальнейшем замыкаем его, чтобы в случае создания нового бакета, запущенные операции записались в старый
    this.bucketName = s3Config.Bucket;
    await this.createBucket(this.bucketName);
  }
}


export default new S3Lib()
