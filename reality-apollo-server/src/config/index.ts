import { Container, Scope } from 'typescript-ioc'
import { ServiceConfig } from './service.config'

export * from './service.config'

Container.bind(ServiceConfig).to(ServiceConfig).scope(Scope.Singleton)

