import gql from 'graphql-tag'

export const typeDefs = gql`
  extend type Query {
    cachedViewport: CachedViewport!
    cachedFilters: CachedFilters!
  }

  extend type Mutation {
    setViewport(cachedViewport: CachedViewportInput!): CachedViewport
    setFilters(cachedFilters: CachedFiltersInput!): CachedFilters
  }

  input CachedFiltersInput {
    advertType: String
    advertSubtype: String
    advertFunction: String
    building_type: String
    ownership: String
    price_from: String
    price_to: String
    floor_number: String
    usable_area: String
  }

  type CachedFilters {
    advertType: String
    advertSubtype: String
    advertFunction: String
    building_type: String
    ownership: String
    price_from: String
    price_to: String
    floor_number: String
    usable_area: String
  }

  input CachedViewportInput {
    width: Float
    height: Float
    latitude: Float
    longitude: Float
    zoom: Float
  }

  type CachedViewport {
    width: Float
    height: Float
    latitude: Float
    longitude: Float
    zoom: Float
  }
`
