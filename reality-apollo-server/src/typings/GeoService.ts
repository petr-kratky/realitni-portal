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
