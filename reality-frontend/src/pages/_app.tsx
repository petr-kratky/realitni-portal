import { ApolloProvider } from "@apollo/react-common";
import { AppProps } from "next/app";
import React, { useEffect } from "react";
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { CircularProgress } from '@material-ui/core';

import { withApolloClient } from "../graphql/apollo-client/withApolloClient";
import { useCurrentUserQuery } from "../graphql/queries/generated/graphql";
import { IAppRoot } from "../types";

import { theme } from '../lib/styles/mui-theme'
import LoginForm from "src/components/forms/LoginForm";
import I18n from "../lib/localization/i18n";
import useI18n from "../lib/hooks/use-i18n";
import CZ from '../locales/cz.json'

function MyComponent({ children, pageProps }) {
  const i18n = useI18n();
  useEffect(() => {
    i18n.locale('en', CZ)
  }, [])

  const { data, loading } = useCurrentUserQuery({ fetchPolicy: "network-only" })

  return (
    <>
      {!loading && (data?.currentUser?.id ? children : <LoginForm {...pageProps} />)}
    </>
  );
}

// https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js
function Application({ Component, apolloClient, pageProps, lngDict, lng }: AppProps & IAppRoot) {

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles?.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <I18n lngDict={lngDict} locale={lng}>
        <ApolloProvider client={apolloClient}>
          <MyComponent pageProps={pageProps}>
            <Component {...pageProps} />
          </MyComponent>
        </ApolloProvider>
      </I18n>
      <CssBaseline />
    </ThemeProvider>
  );
}

export default withApolloClient(Application);
