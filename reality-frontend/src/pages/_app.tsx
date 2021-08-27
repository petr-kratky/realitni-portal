import React, { useEffect } from "react"
import { ApolloProvider } from "@apollo/client"
import { AppProps } from "next/app"

import { createStyles, ThemeProvider } from "@material-ui/styles"
import CssBaseline from "@material-ui/core/CssBaseline"
import { makeStyles, Theme } from "@material-ui/core"

import { withApollo } from "../graphql/apollo-client/withApolloClient"
import { theme } from "../lib/styles/mui-theme"
import Layout from "src/components/Layout"
import { AppRoot } from "src/types"

import estateModalStore, { EstateModalState } from "src/store/estate-modal.store"
import snackStore, { SnackState } from "src/store/snack.store"

const useStyles = makeStyles((theme: Theme) => createStyles({}))

// https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js
function Application({ Component, apolloClient, pageProps }: AppProps & AppRoot) {
  const [estateModalState, setEstateModalState] = React.useState<EstateModalState>(estateModalStore.initialState)
  const [snackState, setSnackState] = React.useState<SnackState>(snackStore.initialState)

  const appState = {
    snack: snackState,
    estateModal: estateModalState
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
    return () => {
      estateModalStoreSub.unsubscribe()
      snackStoreSub.unsubscribe()
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

export default withApollo(Application, { ssr: true })
