import { Inject, Singleton } from "typescript-ioc"
import { S3 } from "aws-sdk"
import * as sharp from "sharp"
import * as crypto from "crypto"

import { ServiceConfig } from "../config"
import { Image, File } from "../models"

@Singleton
export class MediaService {
  @Inject
  private config: ServiceConfig
  private s3: S3

  constructor() {
    this.s3 = new S3({
      accessKeyId: this.config.s3.accessKeyId,
      secretAccessKey: this.config.s3.secretAccessKey,
      region: this.config.s3.region
    })
  }

  private getSignedUrl(objectKey: string): string {
    return this.s3.getSignedUrl("getObject", {
      Bucket: this.config.s3.bucket,
      Key: objectKey,
      Expires: 3600 * 12 // in seconds
    })
  }

  public getFileHashMD5(buffer: Buffer): string {
    return crypto.createHash("MD5").update(buffer).digest("hex")
  }

  public async resizeImage(buffer: Buffer, maxDimension: number): Promise<Buffer> {
    return await sharp(buffer).resize(maxDimension, maxDimension, { fit: "inside" }).withMetadata().toBuffer()
  }

  public async uploadImage(options: {
    estateId: string
    originalImageHash: string
    imageBuffer: Buffer
    imageSize: string
    contentEncoding: string
    contentType: string
  }): Promise<string> {
    const params: S3.PutObjectRequest = {
      Bucket: this.config.s3.bucket,
      Key: `media/estates/${options.estateId}/images/${options.originalImageHash}/${options.imageSize}`,
      ContentEncoding: options.contentEncoding,
      ContentType: options.contentType,
      Body: options.imageBuffer
    }
    return new Promise<string>((resolve, reject) => {
      this.s3.putObject(params, err => {
        if (err) reject(err)
        resolve(options.originalImageHash)
      })
    })
  }

  public async listImages(estateId: string): Promise<Image[]> {
    const params: S3.ListObjectsV2Request = {
      Bucket: this.config.s3.bucket,
      Prefix: `media/estates/${estateId}/images/`
    }
    return new Promise<Image[]>((resolve, reject) => {
      this.s3.listObjectsV2(params, (err, data) => {
        if (err) reject(err)
        // Parse the resulting list of image keys into Set to remove duplicates
        const imageIdList = [...new Set(data.Contents.map(object => object.Key.split(params.Prefix)[1].split("/")[0]))]
        const images: Image[] = imageIdList.map(id => {
          const basePath = params.Prefix + id
          return {
            _id: id,
            original: this.getSignedUrl(`${basePath}/original`),
            large: this.getSignedUrl(`${basePath}/2000`),
            mid: this.getSignedUrl(`${basePath}/1000`),
            small: this.getSignedUrl(`${basePath}/500`)
          }
        })
        resolve(images)
      })
    })
  }

  public async deleteImage(estateId: string, imageId: string): Promise<boolean> {
    const imageKeys = ["2000", "1000", "500", "original"].map(
      size => `media/estates/${estateId}/images/${imageId}/${size}`
    )
    const params: S3.DeleteObjectsRequest = {
      Bucket: this.config.s3.bucket,
      Delete: { Objects: imageKeys.map(key => ({ Key: key })) }
    }
    return new Promise<boolean>((resolve, reject) => {
      this.s3.deleteObjects(params, err => {
        if (err) reject(err)
        resolve(true)
      })
    })
  }

  public async getImage(estateId: string, imageId: string, imageSize): Promise<S3.GetObjectOutput> {
    const params: S3.GetObjectRequest = {
      Bucket: this.config.s3.bucket,
      Key: `media/estates/${estateId}/images/${imageId}/${imageSize}`
    }
    return new Promise<S3.GetObjectOutput>((resolve, reject) => {
      this.s3.getObject(params, (err, data) => {
        if (err) reject(err)
        resolve(data)
      })
    })
  }

  public async uploadFile(file: Express.Multer.File, estateId: string): Promise<string> {
    const params: S3.PutObjectRequest = {
      Bucket: this.config.s3.bucket,
      Key: `media/estates/${estateId}/files/${file.originalname}`,
      ContentEncoding: file.encoding,
      ContentType: file.mimetype,
      Body: file.buffer
    }
    return new Promise<string>((resolve, reject) => {
      this.s3.putObject(params, err => {
        if (err) reject(err)
        resolve(file.originalname)
      })
    })
  }

  public async listFiles(estateId: string): Promise<File[]> {
    const params: S3.ListObjectsV2Request = {
      Bucket: this.config.s3.bucket,
      Prefix: `media/estates/${estateId}/files/`
    }
    return new Promise<File[]>((resolve, reject) => {
      this.s3.listObjectsV2(params, (err, data) => {
        if (err) reject(err)
        const files: File[] = data.Contents.map(object => ({
          _id: object.Key.split(params.Prefix)[1],
          url: this.getSignedUrl(object.Key),
          size: object.Size
        }))
        resolve(files)
      })
    })
  }

  public async getFile(estateId: string, fileKey: string): Promise<S3.GetObjectOutput> {
    const params: S3.GetObjectRequest = {
      Bucket: this.config.s3.bucket,
      Key: `media/estates/${estateId}/files/${fileKey}`
    }
    return new Promise<S3.GetObjectOutput>((resolve, reject) => {
      this.s3.getObject(params, (err, data) => {
        if (err) reject(err)
        resolve(data)
      })
    })
  }
}
