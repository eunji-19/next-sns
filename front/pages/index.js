import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../components/AppLayout";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { LOAD_POST_REQUEST } from "../reducers/post";
import { useInView } from "react-intersection-observer";
import { LOAD_MY_INFO_REQUEST } from "../reducers/user";
import wrapper from "../store/configureStore";
import { END } from "redux-saga";
import axios from "axios";

const Home = () => {
  /**
   * App Layout 의 children : <div>Hello, Next</div>
   * : <AppLayout>하위의 모든 것들</AppLayout>
   */
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePost, loadPostLoading, retweetError } = useSelector(
    (state) => state.post
  );

  const dispatch = useDispatch();

  /**
   * 로그인 여부
   * 게시글 불러오기
   */
  // useEffect(() => {
  //   dispatch({
  //     type: LOAD_USER_REQUEST,
  //   });
  //   dispatch({
  //     type: LOAD_POST_REQUEST,
  //   });
  // }, []);

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  /**
   * 무한 스크롤 -> Request 2번 가는 문제 해결
   */
  const [ref, inView] = useInView();

  // useEffect(() => {
  //   if (inView && hasMorePost && !loadPostLoading) {
  //     const lastId = mainPosts[mainPosts.length - 1]?.id;
  //     dispatch({
  //       type: LOAD_POST_REQUEST,
  //       lastId,
  //     });
  //   }
  // }, [inView, hasMorePost, loadPostLoading, mainPosts]);
  useEffect(() => {
    function onScroll() {
      if (
        window.pageYOffset + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePost && !loadPostLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_POST_REQUEST,
            lastId,
          });
        }
      }
    }
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasMorePost, loadPostLoading, mainPosts]);

  /**
   * Infinite Scroll
   * - scrollY : 얼마나 내렸는지
   * - clientHeight : 화면 보이는 길이
   * - scrollHeight : 총 길이
   */
  // useEffect(() => {
  //   function onScroll() {
  //     console.log(
  //       window.scrollY,
  //       document.documentElement.clientHeight,
  //       document.documentElement.scrollHeight
  //     );
  //     if (
  //       window.scrollY + document.documentElement.clientHeight >
  //       document.documentElement.scrollHeight - 300
  //     ) {
  //       if (hasMorePost && !loadPostLoading) {
  //         dispatch({
  //           type: LOAD_POST_REQUEST,
  //         });
  //       }
  //     }
  //   }

  //   window.addEventListener("scroll", onScroll);
  //   /**
  //    * return 필수임 -> 메모리 쌓이기 때문에 scroll 지워줘야 함
  //    */
  //   return () => {
  //     window.removeEventListener("scroll", onScroll);
  //   };
  // }, [hasMorePost, loadPostLoading]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      <div ref={hasMorePost && !loadPostLoading ? ref : undefined} />
      {/* {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))} */}
    </AppLayout>
  );
};

/**
 * export default Home 보다 먼저 실행됨
 * - 프론트 서버에서 실행됨
 * - 쿠키 전달해야함
 */
export const getServerSideProps = wrapper.getServerSideProps(
  async (context) => {
    // console.log("context : ", context);
    // 서버 쪽으로 쿠키 전달
    const cookie = context.req ? context.req.headers.cookie : "";
    axios.defaults.headers.Cookie = "";

    //
    if (context.req && cookie) {
      axios.defaults.headers.Cookie = cookie;
    }

    context.store.dispatch({
      // type: LOAD_USER_REQUEST,
      type: LOAD_MY_INFO_REQUEST,
    });
    context.store.dispatch({
      type: LOAD_POST_REQUEST,
    });
    context.store.dispatch(END);
    await context.store.sagaTask.toPromise();
    // return {props: {data: 123}}
  }
);

export default Home;
