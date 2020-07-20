import {
  CachedFilters,
  CachedFiltersData,
  CachedFiltersInput,
  CachedViewport,
  CachedViewportData,
  CachedViewportInput,
  ILocalResolvers
} from '../../../types'
import { FILTERS_QUERY, VIEWPORT_QUERY } from './queries'


// https://ryanelainska.com/blog/apollo-getcachekey-with-typescript
export const resolvers: ILocalResolvers = {
  Mutation: {
    setViewport: (_, args: CachedViewportInput, { client }): CachedViewport => {
      const data: CachedViewportData = { cachedViewport: { ...args.cachedViewport, __typename: 'Viewport' } }
      client.writeQuery({ query: VIEWPORT_QUERY, data })
      return data.cachedViewport
    },
    setFilters: (_, args: CachedFiltersInput, { client }): CachedFilters => {
      const data: CachedFiltersData = { cachedFilters: { ...args.cachedFilters, __typename: 'Filters' } }
      client.writeQuery({ query: FILTERS_QUERY, data })
      return data.cachedFilters
    }
  }
}
