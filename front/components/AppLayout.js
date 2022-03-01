import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Link from "next/Link";
import { Menu, Input, Row, Col } from "antd";
import styled from "styled-components";
// import "antd/dist/antd.css";

import UserProfile from "../components/UserProfile";
import LoginForm from "../components/LoginForm";
import { useSelector } from "react-redux";
import useInput from "../hooks/useInput";
import Router from "next/router";

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

/**
 * 가로줄부터 -> 세로줄로
 * 모바일부터 -> 데스크탑 -> 태블릿
 * xs: 모바일
 * sm: 태블릿
 * md: 작은 데스크탑
 */

const AppLayout = ({ children }) => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { me } = useSelector((state) => state.user);
  const [searchInput, onChangeSearchInput] = useInput("");

  const onSearch = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`);
  }, [searchInput]);

  return (
    <div>
      <div>
        <Menu mode="horizontal">
          <Menu.Item key="1">
            <Link href="/">
              <a>노드버드</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link href="/profile">
              <a>프로필</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <SearchInput
              enterButton
              value={searchInput}
              onChange={onChangeSearchInput}
              onSearch={onSearch}
            />
          </Menu.Item>
          <Menu.Item key="4">
            <Link href="/signup">
              <a>회원가입</a>
            </Link>
          </Menu.Item>
        </Menu>
      </div>
      <Row>
        <Col xs={24} md={6}>
          {/* {isLoggedIn ? (
            <UserProfile setIsLoggedIn={setIsLoggedIn} />
          ) : (
            <LoginForm setIsLoggedIn={setIsLoggedIn} />
          )} */}
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <a
            href="https://github.com/eunji-19"
            target="_blank"
            rel="noreferrer noopener"
          >
            Eunji Github
          </a>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  /**
   * node : React의 return 에 들어갈 수 있는 모든 것들
   */
  children: PropTypes.node.isRequired,
};

export default AppLayout;
