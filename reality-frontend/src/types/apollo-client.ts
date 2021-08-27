import { NormalizedCacheObject, ApolloCache } from '@apollo/client/cache'
import { Resolvers, QueryResult, ApolloClient } from '@apollo/client'

type LocalContext = { cache: ApolloCache<NormalizedCacheObject>, client: ApolloClient<NormalizedCacheObject>, [field: string]: any }

type LocalMutation = (rootValue: any, args: any, context: LocalContext, info?: any) => any

export interface LocalQueryResult<TData, TVariables = any> extends QueryResult<TData, TVariables> {
  data: TData
}

export interface ILocalResolvers extends Resolvers {
  Mutation: {
    [key: string]: LocalMutation
  }

  [key: string]: {
    [field: string]: (rootValue?: any, args?: any, context?: any, info?: any) => any;
  };
}

export type CachedViewport = {
  width: number;
  height: number;
  latitude: number;
  longitude: number;
  zoom: number;
  __typename?: string
}

export type CachedFilters = {
  advertType: string
  advertSubtype: string
  advertFunction: string
  building_type: string
  ownership: string
  price_from: string
  price_to: string
  floor_number: string
  usable_area: string
  __typename?: string
}

export type ClientCache = {
  cachedViewport: CachedViewport,
  cachedFilters: CachedFilters
}

export type CachedViewportData = Pick<ClientCache, 'cachedViewport'>
export type CachedViewportInput = CachedViewportData

export type CachedFiltersData = Pick<ClientCache, 'cachedFilters'>
export type CachedFiltersInput = CachedFiltersData

