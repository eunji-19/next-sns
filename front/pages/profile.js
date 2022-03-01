import React, { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import AppLayout from "../components/AppLayout";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";
import { useDispatch, useSelector } from "react-redux";
import Router from "next/router";
import {
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWINGS_REQUEST,
} from "../reducers/user";
import wrapper from "../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";
import useSWR from "swr";
import { BACKEND_URL } from "../config/config";

const fetcher = (url) =>
  axios.get(url, { withCredentials: true }).then((result) => {
    return result.data;
  });

const Profile = () => {
  const { me } = useSelector((state) => state.user);
  // const dispatch = useDispatch();

  const [followersLimit, setFollowersLimit] = useState(3);

  /**
   * SWR 사용하기
   * - fetcher
   * : 주소를 실제 어떻게 가져올지 정하는 것
   * - data
   * : 성공
   * - error
   * : 에러
   * - 둘다 없으면 로딩중
   */
  const { data: followersData, error: followerError } = useSWR(
    `${BACKEND_URL}user/followers?limit=${followersLimit}`,
    fetcher
  );
  const { data: followingsData, error: followingError } = useSWR(
    "${BACKEND_URL}user/followings",
    fetcher
  );

  // useEffect(() => {
  //   dispatch({
  //     type: LOAD_FOLLOWERS_REQUEST,
  //   });
  //   dispatch({
  //     type: LOAD_FOLLOWINGS_REQUEST,
  //   });
  // }, []);

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push("/");
    }
  }, [me && me.id]);

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3);
  }, []);

  if (!me) {
    return "내 정보 로딩중...";
  }

  if (followerError || followingError) {
    console.error(followerError || followingError);
    return <div>팔로워/팔로잉 에러</div>;
  }

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Profile | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉" data={followingsData} />
        <FollowList
          header="팔로워"
          data={followersData}
          onClickMore={loadMoreFollowers}
          loading={!followersData && !followerError}
        />
        {/* <FollowList header="팔로잉" data={me.Following} />
        <FollowList header="팔로워" data={me.Followers} /> */}
      </AppLayout>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";

    // 쿠키를 요청할때만 서버에 보내줌 !!엄청 중요함!!!!!
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }

    context.store.dispatch({
      type: LOAD_FOLLOWERS_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_FOLLOWINGS_REQUEST,
    });

    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
  }
);

export default Profile;
