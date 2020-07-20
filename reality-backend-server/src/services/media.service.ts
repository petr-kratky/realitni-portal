import { Inject, Provides, Singleton } from "typescript-ioc";
import { S3 } from "aws-sdk";
import { ServiceConfig } from "../config/service.config";
import { MediaApi } from "./media.api";
import { LoggerApi } from "../logger";

@Singleton
@Provides(MediaApi)
export class MediaService implements MediaApi {
  @Inject
  config: ServiceConfig;
  logger: LoggerApi;
  s3: S3;

  constructor(
    @Inject
    logger: LoggerApi
  ) {
    this.logger = logger.child("ImageService");
    this.s3 = new S3({
      accessKeyId: this.config.accessKeyId,
      secretAccessKey: this.config.secretAccessKey,
      region: this.config.region,
    });
  }

  private getSignedUrl(objectKey): string {
    return this.s3.getSignedUrl("getObject", {
      Bucket: this.config.bucket,
      Key: objectKey,
      Expires: 300,
    });
  }

  listImages(id: number): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
      this.s3.listObjectsV2(
        {
          Bucket: this.config.bucket,
          Prefix: `media/${id.toString()}/images/`,
        },
        (err, data) => {
          if (err) {
            this.logger.error(err);
            reject(`AWS API Error: ${err.message}`);
          } else {
            const imageList = data.Contents.map((object) =>
              this.getSignedUrl(object.Key)
            );
            resolve(imageList);
          }
        }
      );
    });
  }

  listPdf(id: number): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.s3.listObjectsV2(
        {
          Bucket: this.config.bucket,
          Prefix: `media/${id.toString()}/pdf/`,
        },
        (err, data) => {
          if (err) {
            this.logger.error(err);
            reject(`AWS API Error: ${err.message}`);
          } else {
            const pdfList = data.Contents.map((object) =>{
              return {url: this.getSignedUrl(object.Key), key: object.Key}
            }
            );
            console.log('pdfList', pdfList)
            resolve(pdfList);
          }
        }
      );
    });
  }

  uploadImage(id: number, image: Express.Multer.File): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      const params: S3.PutObjectRequest = {
        Bucket: this.config.bucket,
        Key: `media/${id.toString()}/images/${image.originalname}`,
        ContentEncoding: image.encoding,
        Body: image.buffer,
      };
      this.s3.putObject(params, (err) => {
        if (err) {
          this.logger.error(err);
          reject(`AWS API Error: ${err.message}`);
        } else {
          resolve(this.getSignedUrl(params.Key));
        }
      });
    });
  }

  uploadFile(id: number, pdf: Express.Multer.File): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      const params: S3.PutObjectRequest = {
        Bucket: this.config.bucket,
        Key: `media/${id.toString()}/pdf/${pdf.originalname}`,
        ContentEncoding: pdf.encoding,
        Body: pdf.buffer,
      };
      this.s3.putObject(params, (err) => {
        if (err) {
          this.logger.error(err);
          reject(`AWS API Error: ${err.message}`);
        } else {
          resolve(this.getSignedUrl(params.Key));
        }
      });
    });
  }

  async deleteAllImages(id: number): Promise<boolean>{
     const imagesPromise = new Promise<boolean>((resolve, reject) => {
      this.s3.listObjectsV2(
        {
          Bucket: this.config.bucket,
          Prefix: `media/${id.toString()}/images/`,
        },
        (err, data) => {
          if (err) {
            this.logger.error(err);
            reject(false);
          } else {
            const params = {
              Bucket: this.config.bucket,
              Delete: { Objects: [] },
            };
            if (data.Contents) {
              data.Contents.forEach(function (content) {
                params.Delete.Objects.push({ Key: content.Key });
              });

              this.s3.deleteObjects(params, function (err, data) {
                if (err) {
                  console.log("deleted data ERROR >>>", data);
                  reject(false);
                } else {
                  console.log("deleted data >>>", data);
                  resolve(true);
                }
              });
            }
            resolve(true);
          }
        }
      );
    });
    const filesPromise = new Promise<boolean>((resolve, reject) => {
      this.s3.listObjectsV2(
        {
          Bucket: this.config.bucket,
          Prefix: `media/${id.toString()}/pdf/`,
        },
        (err, data) => {
          if (err) {
            this.logger.error(err);
            reject(false);
          } else {
            const params = {
              Bucket: this.config.bucket,
              Delete: { Objects: [] },
            };
            if (data.Contents) {
              data.Contents.forEach(function (content) {
                params.Delete.Objects.push({ Key: content.Key });
              });

              this.s3.deleteObjects(params, function (err, data) {
                if (err) {
                  console.log("deleted data ERROR >>>", data);
                  reject(false);
                } else {
                  console.log("deleted data >>>", data);
                  resolve(true);
                }
              });
            }
            resolve(true);
          }
        }
      );
    });

    const result = await Promise.all([imagesPromise, filesPromise])
    result.forEach(element => {
      if(!element) return false
    });
    return true
  }
}
