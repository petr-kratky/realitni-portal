import { DatabaseConfig, ServerConfig } from '../typings'
import { Estate, Account } from '../models/'
import { Singleton } from 'typescript-ioc'
import { getEnv } from '../util/get-env'


@Singleton
export class ServiceConfig {
  database: DatabaseConfig
  server: ServerConfig
  dev: boolean

  constructor() {
    this.dev = getEnv('NODE_ENV', 'development') !== 'production'
    this.database = this.getDatabaseConfig()
    this.server = this.getServerConfig()
  }

  private getServerConfig(): ServerConfig {
    return {}
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
      entities: [Estate, Account],
      ssl: {
        rejectUnauthorized: false
      },
    }
  }
}
