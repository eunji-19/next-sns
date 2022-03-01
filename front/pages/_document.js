// _app.js 보다 위에 존재
import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import { ServerStyleSheet } from "styled-components";

export default class MyDocument extends Document {
  /**
   * getInitialProps
   * - app.js, document.js에서만 사용하는 getServerSideProps 기능
   */
  static async getInitialProps(context) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = sheet.renderPage;

    /**
     * styleSheet ServerSideRendering
     */
    try {
      context.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });
      const initalProps = await Document.getInitialProps(context);
      return {
        ...initalProps,
        styles: (
          <>
            {initalProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } catch (err) {
      console.error(err);
    } finally {
      sheet.seal();
    }
  }

  render() {
    <Html>
      <Head />
      <body>
        <Main />
        <script src="https://polyfill.io/v3/polyfill.min.js?features=default%2Ces2015%2Ces2016%2Ces2017%2Ces2018%2Ces2019" />
        <NextScript />
      </body>
    </Html>;
  }
}
