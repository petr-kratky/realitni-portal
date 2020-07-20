import React from 'react'
import { createGenerateId, JssProvider, SheetsRegistry, ThemeProvider } from 'react-jss'
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'

const theme = {
  colorPrimary: 'green',
  background: ''
}
export default class JssDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const registry = new SheetsRegistry()
    const generateId = createGenerateId()
    const originalRenderPage = ctx.renderPage

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => {
          return (
            <JssProvider registry={registry} generateId={generateId}>
              <ThemeProvider theme={theme}>
                <App {...props} />
              </ThemeProvider>
            </JssProvider>
          )
        }
      })
    const initialProps = await Document.getInitialProps(ctx)

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          <style id="server-side-styles">{registry.toString()}</style>
        </>
      )
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap" rel="stylesheet" />
          <link rel="icon" type="image/png" href="/web/home--front.svg" />
          <style global jsx>
            {`
              body {
                font-family: 'Open Sans', sans-serif;
                margin: 0;
              }
            `}
          </style>
        </Head>
        <body>
        <Main />
        <NextScript />
        </body>
      </Html>
    )
  }
}
