import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

export type DatabaseConfig =  PostgresConnectionOptions

export type ServerConfig = {}

export type S3Config = {
    accessKeyId: string
    secretAccessKey: string
    region: string
    bucket: string
}
