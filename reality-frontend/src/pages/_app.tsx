import React, { useEffect } from "react"
import { ApolloProvider } from "@apollo/react-common"
import { AppProps } from "next/app"

import { createStyles, ThemeProvider } from "@material-ui/styles"
import CssBaseline from "@material-ui/core/CssBaseline"
import { makeStyles, Theme } from "@material-ui/core"

import { withApollo } from "../graphql/apollo-client/withApolloClient"
import { theme } from "../lib/styles/mui-theme"
import Layout from "src/components/Layout"
import { AppRoot } from "src/types"

const useStyles = makeStyles((theme: Theme) => createStyles({}))

// https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js
function Application({ Component, apolloClient, pageProps }: AppProps & AppRoot) {
  useEffect(() => {
    const jssStyles = document.querySelector("#jss-server-side")
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={apolloClient}>
        <Layout pageProps={pageProps}>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
      <CssBaseline />
    </ThemeProvider>
  )
}

export default withApollo(Application, { ssr: true })
