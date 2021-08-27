import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions"

export type DatabaseConfig = PostgresConnectionOptions

export type AuthConfig = {
  accessTokenSecret: string
  refreshTokenSecret: string
}

export type ServerConfig = {
  host: string
  protocol: string
  port: string
  domain: string
}

export type S3Config = {
  accessKeyId: string
  secretAccessKey: string
  region: string
  bucket: string
}
