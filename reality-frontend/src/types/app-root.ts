import { ApolloClient } from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import { AppInitialProps, AppProps } from 'next/app';
import { Request, Response } from 'express'
import { NextPageContext } from 'next'

interface IApolloProps {
    apolloState: NormalizedCacheObject;
    apolloClient: ApolloClient<NormalizedCacheObject>;
    serverAccessToken: string;
}

export interface IAppRoot extends IApolloProps {
    AppInitialProps: AppInitialProps,
    AppProps: AppProps,
    lngDict: any,
    lng: string
}

// https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31125#issuecomment-445304740
export interface ExpressNextContext extends NextPageContext {
    req: Request
    res: Response
}
