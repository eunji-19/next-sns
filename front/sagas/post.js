import {
  all,
  fork,
  takeLatest,
  delay,
  put,
  throttle,
  call,
} from "redux-saga/effects";
import axios from "axios";
import {
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  LIKE_POST_FAILURE,
  LIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  LOAD_POST_FAILURE,
  LOAD_POST_REQUEST,
  LOAD_POST_SUCCESS,
  REMOVE_POST_FAILURE,
  REMOVE_POST_REQUEST,
  REMOVE_POST_SUCCESS,
  UNLIKE_POST_FAILURE,
  UNLIKE_POST_REQUEST,
  UNLIKE_POST_SUCCESS,
} from "../reducers/post";
import { ADD_POST_TO_ME, REMOVE_POST_FROM_ME } from "../reducers/user";

function loadPostAPI(data) {
  return axios.get("/posts", data);
}

function* loadPost(action) {
  try {
    // yield delay(1000);
    const result = yield call(loadPostAPI, action.data);
    yield put({
      type: LOAD_POST_SUCCESS,
      data: result.data,
      // data: generateDummyPost(10),
    });
  } catch (err) {
    yield put({
      type: LOAD_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLoadPost() {
  // yield takeLatest(LOAD_POST_REQUEST, loadPost);
  yield throttle(5000, LOAD_POST_REQUEST, loadPost);
}

/**
 * withCredentials -> cookie 보냄
 */
function addPostAPI(data) {
  return axios.post(
    "/post/add",
    { content: data }
    // {
    //   withCredentials: true,
    // }
  );
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);
    // yield delay(1000);

    yield put({
      type: ADD_POST_SUCCESS,
      // data: {
      //   id,
      //   content: action.data,
      // },
      data: result.data,
    });
    yield put({
      type: ADD_POST_TO_ME,
      data: result.data.id,
    });
  } catch (err) {
    yield put({
      type: ADD_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchPostAdd() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function removePostAPI(data) {
  return axios.delete(`/post/${data}`);
}

function* removePost(action) {
  //action.data -> Post의 id값 들어 있음
  try {
    const result = yield call(removePostAPI, action.data);

    yield put({
      type: REMOVE_POST_SUCCESS,
      data: result.data,
    });
    yield put({
      type: REMOVE_POST_FROM_ME,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: REMOVE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchPostRemove() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function addCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, data);
}

function* addComment(action) {
  try {
    const result = yield call(addCommentAPI, action.data);
    // yield delay(1000);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      // data: action.data,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchCommentPost() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

/**
 * patch
 * - 게시글 일부분 수정
 * - data -> PostCarda에서 post.id 값만 받아옴
 */
function likePostAPI(data) {
  return axios.patch(`/post/${data}/like`);
}

function* likePost(action) {
  try {
    const result = yield call(likePostAPI, action.data);

    /**
     * result.data
     * -> postId, UserId 존재
     */
    yield put({
      type: LIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LIKE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}

function unlikePostAPI(data) {
  return axios.delete(`/post/${data}/like`);
  // return axios.patch(`/post/${data}/unlike`);
}

function* unlikePost(action) {
  try {
    const result = yield call(unlikePostAPI, action.data);
    yield put({
      type: UNLIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: UNLIKE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchUnlikePost() {
  yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}

export default function* postSaga() {
  yield all([
    fork(watchLoadPost),
    fork(watchPostAdd),
    fork(watchPostRemove),
    fork(watchCommentPost),
    fork(watchLikePost),
    fork(watchUnlikePost),
  ]);
}
