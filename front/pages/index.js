import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../components/AppLayout";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { LOAD_POST_REQUEST } from "../reducers/post";
import { useInView } from "react-intersection-observer";
import { LOAD_USER_REQUEST } from "../reducers/user";

const Home = () => {
  /**
   * App Layout 의 children : <div>Hello, Next</div>
   * : <AppLayout>하위의 모든 것들</AppLayout>
   */
  const { me } = useSelector((state) => state.user);
  const { mainPosts, hasMorePost, loadPostLoading } = useSelector(
    (state) => state.post
  );

  const dispatch = useDispatch();

  /**
   * 로그인 여부
   * 게시글 불러오기
   */
  useEffect(() => {
    dispatch({
      type: LOAD_USER_REQUEST,
    });
    dispatch({
      type: LOAD_POST_REQUEST,
    });
  }, []);

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
  // useEffect(() => {
  //   if (inView && hasMorePost && !loadPostLoading) {
  //     const lastId = mainPosts[mainPosts.length - 1]?.id;
  //     dispatch({
  //       type: LOAD_POST_REQUEST,
  //       lastId,
  //     });
  //   }
  // }, [inView, mainPosts]);

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

export default Home;
