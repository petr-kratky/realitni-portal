import React, { ReactNode } from "react"

import { ApolloClient } from "@apollo/client"
import { NormalizedCacheObject } from "@apollo/client/cache"

import Head from "next/head"

import cookie from "cookie"
import fetch from "isomorphic-fetch"

import { getAccessToken, setAccessToken } from "../../lib/auth/accessToken"
import { initApollo } from "./initApollo"
import { NextPageContextApp } from "../../types"

const isServer = () => typeof window === "undefined"

/**
 * Creates and provides the apolloContext
 * to a next.js PageTree. Use it by wrapping
 * your PageComponent via HOC pattern.
 * @param {Function|Class} PageComponent
 * @param {Object} [config]
 * @param {Boolean} [config.ssr=true]
 */
export function withApollo(PageComponent: any, { ssr = true } = {}): ReactNode {
  const WithApollo = ({
    apolloClient,
    apolloState,
    serverAccessToken,
    ...pageProps
  }: {
    apolloClient: ApolloClient<NormalizedCacheObject>
    apolloState: NormalizedCacheObject
    serverAccessToken: string
  }): ReactNode => {
    if (!isServer() && !getAccessToken()) {
      setAccessToken(serverAccessToken)
    }
    const client = apolloClient || initApollo(apolloState)
    return <PageComponent {...pageProps} apolloClient={client} />
  }

  if (process.env.NODE_ENV !== "production") {
    // Find correct display name
    const displayName = PageComponent.displayName || PageComponent.name || "Component"

    // Warn if old way of installing apollo is used
    if (displayName === "App") {
      console.warn("This withApollo HOC only works with PageComponents.")
    }

    // Set correct display name for devtools
    WithApollo.displayName = `withApollo(${displayName})`
  }

  if (ssr || PageComponent.getInitialProps) {
    WithApollo.getInitialProps = async (ctx: NextPageContextApp) => {
      const {
        AppTree,
        ctx: { req, res }
      } = ctx

      let serverAccessToken = ""

      if (isServer()) {
        const cookies = cookie.parse(req?.headers.cookie ?? "")

        if (cookies.jid) {
          try {
            const response = await fetch(`http://${process.env.HOST}:${process.env.PORT}/api/auth/refresh`, {
              method: "POST",
              credentials: "include",
              headers: {
                cookie: "jid=" + cookies.jid
              }
            })
            const data = await response.json()
            serverAccessToken = data.accessToken
          } catch (err) {
            console.error(err)
          }
        }
      }

      // Run all GraphQL queries in the component tree
      // and extract the resulting data
      const apolloClient = (ctx.ctx.apolloClient = initApollo({}, serverAccessToken))

      const pageProps = PageComponent.getInitialProps ? await PageComponent.getInitialProps(ctx) : {}

      // Only on the server
      if (isServer()) {
        // When redirecting, the response is finished.
        // No point in continuing to render
        if (res && res.finished) {
          return {}
        }

        if (ssr) {
          try {
            // Run all GraphQL queries
            const { getDataFromTree } = await import("@apollo/client/react/ssr")
            await getDataFromTree(
              <AppTree
                pageProps={{
                  ...pageProps,
                  apolloClient
                }}
                apolloClient={apolloClient}
              />
            )
          } catch (error) {
            // Prevent Apollo Client GraphQL errors from crashing SSR.
            // Handle them in components via the data.error prop:
            // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
            // console.error("Error while running `getDataFromTree`", error);
          }
        }

        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        // Head.rewind()
      }

      // Extract query data from the Apollo store
      const apolloState = apolloClient.cache.extract()

      return {
        ...pageProps,
        apolloState,
        serverAccessToken
      }
    }
  }

  return WithApollo
}

const redirect = (ctx: NextPageContextApp, target: string) => {
  if (ctx.ctx.res) {
    // server
    // 303: "See other"
    ctx.ctx.res.writeHead(303, { Location: target })
    ctx.ctx.res.end()
  } else {
    // In the browser, we just pretend like this never even happened ;)
    ctx.router.replace(target)
  }
}
