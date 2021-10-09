import React, { useEffect } from "react"
import { ApolloProvider } from "@apollo/client"
import { AppProps } from "next/app"

import { parseCookies } from "nookies"

import { createStyles, ThemeProvider } from "@material-ui/styles"
import { makeStyles, Theme, CssBaseline } from "@material-ui/core"

import { withApollo } from "../graphql/apollo-client/withApolloClient"
import { theme } from "../lib/styles/mui-theme"
import Layout from "src/components/layout/Layout"
import { AppRoot, NextPageContextApp } from "src/types"
import {
  estateModalStore,
  EstateModalState,
  snackStore,
  SnackState,
  viewportStore,
  ViewportState,
  geojsonStore,
  GeojsonState
} from "src/lib/stores"

type AppCustomProps = {
  // drawer: boolean
}

const useStyles = makeStyles((theme: Theme) => createStyles({}))

// https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js
function Application({ Component, apolloClient, pageProps }: AppProps & AppRoot & AppCustomProps) {
  const [estateModalState, setEstateModalState] = React.useState<EstateModalState>(estateModalStore.initialState)
  const [snackState, setSnackState] = React.useState<SnackState>(snackStore.initialState)
  const [viewportState, setViewportState] = React.useState<ViewportState>(viewportStore.initialState)
  const [geojsonState, setGeojsonState] = React.useState<GeojsonState>(geojsonStore.initialState)

  const appState = {
    snack: snackState,
    estateModal: estateModalState,
    viewport: viewportState,
    geojson: geojsonState
  }

  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side")
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  useEffect(() => {
    const estateModalStoreSub = estateModalStore.subscribe(setEstateModalState)
    const snackStoreSub = snackStore.subscribe(setSnackState)
    const viewportStoreSub = viewportStore.subscribe(setViewportState)
    const geojsonStoreSub = geojsonStore.subscribe(setGeojsonState)
    return () => {
      estateModalStoreSub.unsubscribe()
      snackStoreSub.unsubscribe()
      viewportStoreSub.unsubscribe()
      geojsonStoreSub.unsubscribe()
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={apolloClient}>
        <Layout pageProps={pageProps} appState={appState}>
          <Component {...pageProps} appState={appState} />
        </Layout>
      </ApolloProvider>
      <CssBaseline />
    </ThemeProvider>
  )
}

Application.getInitialProps = async (ctx: NextPageContextApp) => {
  if (!process.browser) {
    const cookies = parseCookies(ctx.ctx)
    return {
      // drawer: cookies.drawer === "true" || typeof cookies.drawer === "undefined"
    }
  }
}

export default withApollo(Application, { ssr: true })
