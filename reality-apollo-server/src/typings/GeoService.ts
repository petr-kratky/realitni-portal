import { Feature, Point } from "geojson"

type EstateFeatureProperties = {
  id: string
}

export type EstateFeature = Feature<Point, EstateFeatureProperties>

export type GeoJSONRequestParams = {
  columns: Array<string>
  bounds: Array<number>
  filter?: string
  geom_column?: string
}

export type GeoJSONQueryOptions = GeoJSONRequestParams & {
  table: string
}

interface GeocodeBaseOptions {
  language: string
  region: string
}

interface StandardGeocodeOptions extends GeocodeBaseOptions {
  address: string
  latlng?: never
}

interface ReverseGeocodeOptions extends GeocodeBaseOptions {
  latlng: string
  address?: never
}

export type GeocodeOptions = StandardGeocodeOptions | ReverseGeocodeOptions