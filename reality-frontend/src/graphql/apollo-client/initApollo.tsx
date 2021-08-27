import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { ApolloLink } from "apollo-link";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import { onError } from "apollo-link-error";
import { setContext } from "apollo-link-context";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";

import jwtDecode from "jwt-decode";
import isomorphicFetch from "isomorphic-fetch";

import { resolvers } from "./client-cache/resolvers";
import { typeDefs } from "./client-cache/local-schema";
import {
  getAccessToken,
  setAccessToken,
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
      return isomorphicFetch(origin + uri, options);
    },
  })

  const refreshLink = new TokenRefreshLink({
    accessTokenField: "accessToken",
    isTokenValidOrUndefined: () => {
      const token = getAccessToken();

      if (!token) {
        return true;
      }

      try {
        const { exp } = jwtDecode(token);
        if (Date.now() >= exp * 1000) {
          return false;
        } else {
          return true;
        }
      } catch {
        return false;
      }
    },
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
    cache: new InMemoryCache().restore(initialState),
    resolvers,
    typeDefs,
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
