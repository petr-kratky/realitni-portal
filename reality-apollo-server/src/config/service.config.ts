import { AuthConfig, DatabaseConfig, S3Config, ServerConfig } from '../typings'
import { Estate, Account, EstatePrimaryType, EstateSecondaryType } from '../models/'
import { Singleton } from 'typescript-ioc'
import { getEnv } from '../util/get-env'


@Singleton
export class ServiceConfig {
  database: DatabaseConfig
  server: ServerConfig
  s3: S3Config
  auth: AuthConfig
  dev: boolean

  constructor() {
    this.dev = getEnv('NODE_ENV', 'development') !== 'production'
    this.database = this.getDatabaseConfig()
    this.server = this.getServerConfig()
    this.s3 = this.getS3Config()
    this.auth = this.getAuthConfig()
  }

  private getAuthConfig(): AuthConfig {
    return {
      accessTokenSecret: getEnv('ACCESS_TOKEN_SECRET', ''),
      refreshTokenSecret: getEnv('REFRESH_TOKEN_SECRET', '')
    }
  }

  private getServerConfig(): ServerConfig {
    return {
      port: getEnv('PORT', '4000'),
      host: getEnv('HOST', 'localhost'),
      protocol: getEnv('PROTOCOL', 'http'),
      domain: getEnv('DOMAIN', 'localhost')
    }
  }

  private getDatabaseConfig(): DatabaseConfig {
    return {
      type: 'postgres',
      host: getEnv('DB_HOST'),
      port: +getEnv('DB_PORT'),
      username: getEnv('DB_USER'),
      password: getEnv('DB_PASS'),
      database: getEnv('DB_NAME'),
      schema: getEnv('DB_SCHEMA', 'public'),
      dropSchema: false,
      synchronize: false,
      logging: false,
      // entities: [...Object.values(DatabaseModels)],
      entities: [Estate, EstatePrimaryType, EstateSecondaryType, Account],
      ssl: {
        rejectUnauthorized: false
      },
    }
  }

  private getS3Config(): S3Config {
    return {
      accessKeyId: getEnv('AWS_KEY_ID'),
      secretAccessKey: getEnv('AWS_SECRET_KEY'),
      region: getEnv('AWS_REGION'),
      bucket: getEnv('AWS_S3_BUCKET_NAME'),
    }
  }
}
