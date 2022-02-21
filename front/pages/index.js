import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AppLayout from "../components/AppLayout";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import { generateDummyPost, LOAD_POST_REQUEST } from "../reducers/post";

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

  useEffect(() => {
    dispatch({
      type: LOAD_POST_REQUEST,
    });
  }, []);

  /**
   * Infinite Scroll
   * - scrollY : 얼마나 내렸는지
   * - clientHeight : 화면 보이는 길이
   * - scrollHeight : 총 길이
   */
  useEffect(() => {
    function onScroll() {
      console.log(
        window.scrollY,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight
      );
      if (
        window.scrollY + document.documentElement.clientHeight >
        document.documentElement.scrollHeight - 300
      ) {
        if (hasMorePost && !loadPostLoading) {
          dispatch({
            type: LOAD_POST_REQUEST,
          });
        }
      }
    }

    window.addEventListener("scroll", onScroll);
    /**
     * return 필수임 -> 메모리 쌓이기 때문에 scroll 지워줘야 함
     */
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [hasMorePost, loadPostLoading]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </AppLayout>
  );
};

export default Home;
