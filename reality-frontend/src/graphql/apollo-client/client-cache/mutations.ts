import gql from 'graphql-tag'

export const SET_VIEWPORT = gql`
  mutation setViewport($cachedViewport: CachedViewportInput!) {
    setViewport(cachedViewport: $cachedViewport) @client
  }
`
export const SET_FILTERS = gql`
  mutation setFilters($cachedFilters: CachedFiltersInput!) {
    setFilters(cachedFilters: $cachedFilters) @client
  } 
`
