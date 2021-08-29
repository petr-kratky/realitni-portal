import { Inject } from "typescript-ioc"
import { Errors, Path, PathParam, POST, PreProcessor } from "typescript-rest"
import { GeoJSON } from "geojson"

import { GeoService } from "../services/geo.service"
import { authenticate } from "../decorators/auth-rest"
import { GeoJSONRequestParams } from "../typings/GeoService"

@Path("/gis")
export class GeoController {
  @Inject
  geoService: GeoService

  @POST
  @Path("/geojson/:table")
  @PreProcessor(authenticate)
  async getGeoJSON(@PathParam("table") table: string, options: GeoJSONRequestParams): Promise<GeoJSON> {
    try {
      return await this.geoService.getGeoJSON({ ...options, table })
    } catch (err) {
      throw new Errors.InternalServerError(err)
    }
  }
}
