export class ServiceConfig {
  accessKeyId: string
  secretAccessKey: string
  region: string
  bucket: string

  constructor() {
    this.accessKeyId = process.env.AWS_KEY_ID
    this.secretAccessKey = process.env.AWS_SECRET_KEY
    this.region = process.env.AWS_REGION
    this.bucket = process.env.BUCKET_NAME
  }
}
