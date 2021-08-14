import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { NextPageContext } from "next";
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { setContext } from "apollo-link-context";
import jwtDecode from "jwt-decode";
import { TokenRefreshLink } from "apollo-link-token-refresh";
import isomorphicFetch from "isomorphic-fetch";

import { resolvers } from "./client-cache/resolvers";
import { typeDefs } from "./client-cache/local-schema";
import {
  getAccessToken,
  setAccessToken,
} from "src/lib/user-management/accessToken";

import { createUploadLink } from "apollo-upload-client";

const isServer = () => typeof window === "undefined";

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

function create(
  initialState: NormalizedCacheObject,
  context?: NextPageContext,
  serverAccessToken?: string
) {
  const origin = isServer() ? `http://${process.env.HOST}:${process.env.PORT}` : ''
  // We want to get fresh csrf token for each request, csrf based on cookie secret
  // csrf token is provided by _app.js
  const getRequestOptions = <T extends RequestInit>(options: T): T => {
    // let csrfToken = '';
    // if (process.browser) {
    //   // @ts-ignore
    //   ({ csrfToken } = window.__NEXT_DATA__.props);
    // } else {
    //   csrfToken = req && req.csrfToken ? req.csrfToken() : '';
    // }
    // return {
    //   ...options,
    //   headers: {
    //     ...(options && options.headers ? options.headers : {}),
    //     'x-csrf-token': csrfToken,
    //     accept: 'application/json',
    //   },
    // };
    return options;
  };

  const commonOpts = {
    credentials: "include",
    uri: "/api/graphql",
    headers: context?.req?.headers ?? {},
  };
  const batchOpts = {
    ...commonOpts,
    batchMax: 20,
    fetch: (uri: string, options: RequestInit) => {
      const fetchOptions: RequestInit = getRequestOptions(options);
      return isomorphicFetch(origin + uri, fetchOptions);
    },
  };

  const httpLink = new HttpLink(batchOpts)

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
      return fetch(`${origin}/api/refresh_token`, {
        method: "POST",
        credentials: "include",
        body:"{}"
      });
    },
    handleFetch: (accessToken) => {
      setAccessToken(accessToken);
    },
    handleError: (err) => {
      console.warn("Your refresh token is invalid. Try to relogin");
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

function initApollo(
  initialState: NormalizedCacheObject,
  ctx?: NextPageContext,
  serverAccessToken?: string
): ApolloClient<NormalizedCacheObject> {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    apolloClient = create(initialState, ctx, serverAccessToken);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, ctx);
  }

  return apolloClient;
}

export { initApollo };
