import React from "react";
import PropTypes from "prop-types";
import "antd/dist/antd.css";
import Head from "next/head";
import wrapper from "../store/configureStore";

/**
 * 모든 페이지에서 공통일 경우
 * Redux 사용법
 * - wrapper.withRedux(App)
 * - HighOrderComponent로 감싸줌
 * - redux : Provider로 감싸주지 않는다
 */
const App = ({ Component }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>NodeBird</title>
      </Head>
      <Component />
    </>
  );
};

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(App);
