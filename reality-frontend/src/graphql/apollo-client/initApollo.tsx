import { ApolloLink, ApolloClient } from "@apollo/client";
import { InMemoryCache, NormalizedCacheObject } from "@apollo/client/cache";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { HttpLink } from "@apollo/client/link/http";

import fetch from "isomorphic-fetch";

import {
  getAccessToken,
  setAccessToken,
  validateAccessToken
} from "src/lib/auth/accessToken";

// import { createUploadLink } from "apollo-upload-client";

const isServer = () => typeof window === "undefined";

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

/**
 * Creates and configures the ApolloClient
 * @param  {Object} [initialState={}]
 * @param  {Object} config
 */
 function createApolloClient(initialState = {}, serverAccessToken?: string) {
  const origin = isServer() ? `http://${process.env.HOST}:${process.env.PORT}` : ''

  const httpLink = new HttpLink({
    credentials: "include",
    uri: "/api/graphql",
    fetch: (uri: string, options: RequestInit) => {
      return fetch(origin + uri, options);
    },
  })

  const refreshLink = new TokenRefreshLink({
    accessTokenField: "accessToken",
    isTokenValidOrUndefined: validateAccessToken,
    fetchAccessToken: () => {
      return fetch(`${origin}/api/auth/refresh`, {
        method: "POST",
        credentials: "include"
      });
    },
    handleFetch: (accessToken) => {
      setAccessToken(accessToken);
    },
    handleError: (err) => {
      console.warn("Your refresh token is invalid. Try to re-login.");
      console.error(err);
    },
  });

  const authLink = setContext((_request, { headers }) => {
    const token = isServer() ? serverAccessToken : getAccessToken();
    return {
      headers: {
        ...headers,
        authorization: token ? `bearer ${token}` : "",
      },
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    console.log('GraphQL error(s):', graphQLErrors);
    console.log('Network error(s):', networkError);
  });

  return new ApolloClient({
    ssrMode: typeof window === "undefined", // Disables forceFetch on the server (so queries are only run once)
    link: ApolloLink.from([refreshLink, authLink, errorLink, httpLink]),
    cache: new InMemoryCache().restore(initialState)
  });
}

/**
 * Always creates a new apollo client on the server
 * Creates or reuses apollo client in the browser.
 */
function initApollo(
  initialState: NormalizedCacheObject,
  serverAccessToken?: string
): ApolloClient<NormalizedCacheObject> {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (isServer()) {
    apolloClient = createApolloClient(initialState, serverAccessToken);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = createApolloClient(initialState);
  }

  return apolloClient;
}

export { initApollo };
