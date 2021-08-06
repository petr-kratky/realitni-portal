import { ApolloProvider } from "@apollo/react-common";
import App from "next/app";
import React, { useState, useEffect } from "react";
import { ThemeProvider } from '@material-ui/styles';

import { withApolloClient } from "../graphql/apollo-client/withApolloClient";
import { IAppRoot } from "../types";
import { useMeQuery } from "src/graphql/queries/generated/graphql";

import "antd/dist/antd.css";
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

  const { data, loading, error } = useMeQuery({
    fetchPolicy: "network-only",
  });
  return (
    <>
      {loading && <h1> Loading ...</h1>}
      {!loading && data && children}
      {!data && !loading && <LoginForm {...pageProps} />}
    </>
  );
}

class Application extends App<IAppRoot> {
  render() {
    const { Component, apolloClient, pageProps, lngDict, lng } = this.props;

    return (
      <I18n lngDict={lngDict} locale={lng}>
        <ApolloProvider client={apolloClient}>
          <ThemeProvider theme={theme}>
            <MyComponent pageProps={pageProps}>
              <Component {...pageProps} />
            </MyComponent>
          </ThemeProvider>
        </ApolloProvider>
      </I18n>
    );
  }
}

export default withApolloClient(Application);
