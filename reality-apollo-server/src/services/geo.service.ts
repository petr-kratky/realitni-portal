import { getConnection } from "typeorm"
import { Inject, Singleton } from "typescript-ioc"
import { GeoJSON } from "geojson"
import * as fetch from "isomorphic-fetch"

import { GeocodeOptions, GeoJSONQueryOptions } from "../typings/GeoService"
import { ServiceConfig } from "../config"

const sql = ({ bounds, columns, geom_column = "geom", table, filter }: GeoJSONQueryOptions): string => {
  return `
    SELECT 
      Row_to_json(fc) as geojson

    FROM (
      SELECT 
        'FeatureCollection' AS type, 
        COALESCE(Array_to_json(Array_agg(f)), '[]'::json) AS features

    FROM (
      SELECT 
        'Feature' AS type, 
        St_asgeojson(ST_Transform(lg.${geom_column}, 4326))::json AS geometry,
        ${
          columns.join()
            ? ` 
        Row_to_json(
          (
            SELECT 
              l 
            FROM   
          (SELECT ${columns.join()}) AS l
          )
        ) AS properties 
        `
            : `'{}'::json AS properties`
        }
                  
      FROM   
        ${table} AS lg
        ${bounds ? `, (SELECT ST_SRID(${geom_column}) as srid FROM ${table} LIMIT 1) sq` : ""}
      
        -- Optional Filter
        ${filter || bounds ? "WHERE" : ""}
        ${filter ? `${filter}` : ""}
        ${filter && bounds ? "AND" : ""}
        ${bounds ? `${geom_column} && ST_Transform(ST_MakeEnvelope(${bounds.join()}, 4326), srid)` : ""}
      ) AS f
    ) AS fc; 
  `
}

@Singleton
export class GeoService {
  @Inject
  config: ServiceConfig

  public async getGeoJSON(options: GeoJSONQueryOptions): Promise<GeoJSON> {
    try {
      const data = await getConnection().query(sql(options))
      const geojson = data[0]?.geojson
      if (!geojson) {
        throw new Error("Unknown error occured during geojson database query. Check logs for more details.")
      } else {
        return geojson
      }
    } catch (err) {
      throw new Error(err)
    }
  }

  public async geocode(options: GeocodeOptions): Promise<any> {
    const geocodeEndpoint = "https://maps.googleapis.com/maps/api/geocode/json"
    const geocodeURL: URL = new URL(geocodeEndpoint)

    Object.entries({ ...options, key: this.config.google.apiKey }).forEach(entry =>
      geocodeURL.searchParams.append(entry[0], entry[1] as string)
    )
    
    try {
      return await (await fetch(geocodeURL.href)).json()
    } catch (err) {
      throw new Error(err)
    }
  }
}
