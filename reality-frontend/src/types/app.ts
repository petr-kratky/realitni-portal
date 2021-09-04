import { ApolloClient } from "@apollo/client"
import { NormalizedCacheObject } from "@apollo/client/cache"
import { NextPageContext } from "next"
import { AppContext, AppInitialProps, AppProps } from "next/app"
import { Request, Response } from "express"

import { ViewportState, EstateModalState, SnackState, GeojsonState } from "../lib/stores"

interface ApolloProps {
  apolloState: NormalizedCacheObject
  apolloClient: ApolloClient<NormalizedCacheObject>
  serverAccessToken: string
}

export interface AppRoot extends ApolloProps {
  AppInitialProps: AppInitialProps
  AppProps: AppProps
}

// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31125#issuecomment-445304740
export interface ExpressNextContext extends NextPageContext {
  req: Request
  res: Response
}

interface NextPageContextWithApollo extends NextPageContext {
  apolloClient: ApolloClient<NormalizedCacheObject> | null
  apolloState: NormalizedCacheObject
  ctx: NextPageContextApp
}

export type NextPageContextApp = NextPageContextWithApollo & AppContext

export type AppState = {
  appState: {
    snack: SnackState
    estateModal: EstateModalState
    viewport: ViewportState
    geojson: GeojsonState
  }
}
