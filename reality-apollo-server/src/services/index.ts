import { Container, Scope } from 'typescript-ioc';

import { EstateApi } from './estate.api';
import { EstateService } from './estate.service';

export * from './estate.api';
export * from './estate.service';

Container.bind(EstateApi).to(EstateService).scope(Scope.Singleton);