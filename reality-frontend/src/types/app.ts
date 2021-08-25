import { ApolloClient } from "apollo-client"
import { NormalizedCacheObject } from "apollo-cache-inmemory"
import { AppInitialProps, AppProps } from "next/app"
import { Request, Response } from "express"
import { NextPageContext } from "next"
import { SnackState } from "src/store/snack.store"
import { EstateModalState } from "src/store/estate-modal.store"

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

export type AppState = {
  appState: {
    snack: SnackState
    estateModal: EstateModalState
  }
}
