import { Context, GET, Path, ServiceContext } from "typescript-rest"

@Path("/health")
export class HealthController {
  @GET
  async healthCheck(@Context { response }: ServiceContext): Promise<void> {
    response.sendStatus(200)
  }
}
