import { Inject } from "typescript-ioc"
import { Errors, Path, PathParam, POST, PreProcessor } from "typescript-rest"
import { GeoJSON } from "geojson"

import { GeoService } from "../services/geo.service"
import { authenticate } from "../decorators/auth-rest"
import { GeocodeOptions, GeoJSONRequestParams } from "../typings/GeoService"

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

  @POST
  @Path("/geocode")
  @PreProcessor(authenticate)
  async geocode(geocodeOptions: GeocodeOptions): Promise<any> {
    if (geocodeOptions.address && geocodeOptions.latlng) {
      throw new Errors.BadRequestError('Parameters "latlng" and "address" cannot both be present in a single request.')
    }
    try {
      return await this.geoService.geocode(geocodeOptions)
    } catch (err) {
      throw new Errors.InternalServerError(err)
    }
  }
}
