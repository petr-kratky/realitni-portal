import { GET, Path, PathParam } from 'typescript-rest';
import { Inject } from 'typescript-ioc'
import { EstateService } from '../services/estate.service'
import { Estate } from '../models'

@Path('/test')
export class HealthController {
  @Inject
  estateService: EstateService

  @GET
  @Path('getEstateById')
  async test(@PathParam('id') id: number,): Promise<Estate> {
    //@PathParam	Parameter in requested URL path
    return await this.estateService.getEstateById(id)
  }
}
