import { ConnectionOptions } from 'typeorm'
import { ServiceConfig } from './src/config'

const { database }: ServiceConfig = new ServiceConfig()

// Example create migration command syntax:
// npm run typeorm:cli -- migration:generate -n "init"

// console.log(database);

const ORMConfig: ConnectionOptions = {
  ...database,
  logging: true,
  synchronize: false,
  migrations: ['src/migrations/*.ts'],
  cli: {
    migrationsDir: 'src/migrations'
  }
}

export = ORMConfig
