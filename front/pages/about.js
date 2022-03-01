import React from "react";
import Head from "next/head";
import AppLayout from "../components/AppLayout";
import { useSelector } from "react-redux";
import { Avatar, Card } from "antd";
import wrapper from "../store/configureStore";
import { LOAD_USER_REQUEST } from "../reducers/user";
import { END } from "redux-saga";

const About = () => {
  const { userInfo } = useSelector((state) => state.user);
  return (
    <AppLayout>
      <Head>
        <title>EunjiCho | NodeBird</title>
      </Head>
      {userInfo ? (
        <Card
          actions={[
            <div key="twit">
              짹짹
              <br />
              {userInfo.Posts}
            </div>,
            <div key="following">
              팔로잉
              <br />
              {userInfo.Following}
            </div>,
            <div key="follower">
              팔로워
              <br />
              {userInfo.Followers}
            </div>,
          ]}
        >
          <Card.Meta
            avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
            title={userInfo.nickname}
            description="노드버드 매니아"
          />
        </Card>
      ) : null}
    </AppLayout>
  );
};

/**
 * getStaticProps
 * - 언제 접속해도 데이터가 바뀔일 없는 경우
 * - next가 빌드할때 정적인 html 파일로 바꿔줌
 * getServerSideProps
 * - 접속한 환경에 따라서 데이터가 바뀔 경우
 */
export const getStaticProps = wrapper.getStaticProps(async (context) => {
  context.store.dispatch({
    type: LOAD_USER_REQUEST,
    data: 1,
  });

  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default About;
