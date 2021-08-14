import { ApolloClient } from 'apollo-client'
import { NormalizedCacheObject, InMemoryCache } from 'apollo-cache-inmemory'
import { getDataFromTree } from 'react-apollo';
import App, { AppContext } from 'next/app';
import Head from 'next/head';
import React from 'react';
import cookie from "cookie";
import { HttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import fetch from "isomorphic-unfetch";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import jwtDecode from "jwt-decode";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import isomorphicFetch from 'isomorphic-fetch';


import { getAccessToken, setAccessToken } from "../../lib/user-management/accessToken"; 
import { IAppRoot } from "../../types/app-root";
import initialState from './client-cache/initialState'
import { initApollo } from './initApollo';

const isServer = () => typeof window === "undefined";

/**
 * Creates and provides the apolloContext
 * to a next.js PageTree. Use it by wrapping
 * your PageComponent via HOC pattern.
 * @param {Function|Class} PageComponent
 * @param {Object} [config]
 * @param {Boolean} [config.ssr=true]
 */
export function withApolloClient(PageComponent: any, { ssr = true } = {}) {
  const WithApolloClient = ({
    apolloClient,
    serverAccessToken,
    apolloState,
    ...pageProps
  }: any) => {
    if (!isServer() && !getAccessToken()) {
      setAccessToken(serverAccessToken);
    }
    const client = apolloClient || initApollo(apolloState);
    return <PageComponent {...pageProps} apolloClient={client} />;
  };

  if (process.env.NODE_ENV !== "production") {
    // Find correct display name
    const displayName =
      PageComponent.displayName || PageComponent.name || "Component";

    // Warn if old way of installing apollo is used
    if (displayName === "App") {
      console.warn("This withApollo HOC only works with PageComponents.");
    }

    // Set correct display name for devtools
    WithApolloClient.displayName = `withApollo(${displayName})`;
  }

  if (ssr || PageComponent.getInitialProps) {
    WithApolloClient.getInitialProps = async (ctx: any) => {
      const {
        AppTree,
        ctx: { req, res }
      } = ctx;

      let serverAccessToken = "";

      if (isServer()) {
        const cookies = cookie.parse(req.headers.cookie?? "");
        if (cookies.jid) {
          const response = await fetch(`http://${process.env.HOST}:${process.env.PORT}/api/refresh_token`, {
            method: "POST",
            credentials: "include",
            headers: {
              cookie: "jid=" + cookies.jid
            }
          });
          const data = await response.json();
          serverAccessToken = data.accessToken;
        }
      }

      // Run all GraphQL queries in the component tree
      // and extract the resulting data
      const apolloClient = (ctx.ctx.apolloClient = initApollo(
        {},
        undefined,
        serverAccessToken
      ));
      apolloClient.cache.writeData({ data: initialState })
      apolloClient.onResetStore(async () => apolloClient.cache.writeData({ data: initialState }))

      const pageProps = PageComponent.getInitialProps
        ? await PageComponent.getInitialProps(ctx)
        : {};

      // Only on the server
      if (typeof window === "undefined") {
        // When redirecting, the response is finished.
        // No point in continuing to render
        if (res && res.finished) {
          return {};
        }

        if (ssr) {
          try {
            // Run all GraphQL queries
            const { getDataFromTree } = await import("@apollo/react-ssr");
            await getDataFromTree(
              <AppTree
                pageProps={{
                  ...pageProps,
                  apolloClient
                }}
                apolloClient={apolloClient}
              />
            );
          } catch (error) {
            // Prevent Apollo Client GraphQL errors from crashing SSR.
            // Handle them in components via the data.error prop:
            // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
            // console.error("Error while running `getDataFromTree`", error);
          }
        }

        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      // Extract query data from the Apollo store
      const apolloState = apolloClient.cache.extract();

      return {
        ...pageProps,
        apolloState,
        serverAccessToken
      };
    };
  }

  return WithApolloClient;
}
