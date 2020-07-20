import gql from 'graphql-tag'

export const VIEWPORT_QUERY = gql`
  query CachedViewport {
    cachedViewport @client {
      width, height, latitude, longitude, zoom
    }
  }
`

export const FILTERS_QUERY = gql`
  query CachedFilters {
    cachedFilters @client {
      advertType, advertSubtype, advertFunction, building_type, ownership, price_from, price_to, floor_number, usable_area
    }
  }
`
