import { all, fork, takeLatest, delay, put, call } from "redux-saga/effects";
import axios from "axios";
import {
  CHANGE_NICKNAME_FAILURE,
  CHANGE_NICKNAME_REQUEST,
  CHANGE_NICKNAME_SUCCESS,
  FOLLOW_FAILURE,
  FOLLOW_REQUEST,
  FOLLOW_SUCCESS,
  LOAD_FOLLOWERS_FAILURE,
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWERS_SUCCESS,
  LOAD_FOLLOWINGS_FAILURE,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_FOLLOWINGS_SUCCESS,
  LOAD_MY_INFO_FAILURE,
  LOAD_MY_INFO_REQUEST,
  LOAD_MY_INFO_SUCCESS,
  LOAD_USER_FAILURE,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  REMOVE_FOLLOWER_FAILURE,
  REMOVE_FOLLOWER_REQUEST,
  REMOVE_FOLLOWER_SUCCESS,
  SIGNUP_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  UNFOLLOW_FAILURE,
  UNFOLLOW_REQUEST,
  UNFOLLOW_SUCCESS,
} from "../reducers/user";

function loadMyInfoAPI() {
  return axios.get(`/user/login`);
}

function* loadMyInfo() {
  try {
    const result = yield call(loadMyInfoAPI);
    yield put({
      type: LOAD_MY_INFO_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_MY_INFO_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLoadMyInfo() {
  yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo);
}

function loadUserAPI(data) {
  return axios.get(`/user/info/${data}`, {
    withCredentials: true,
  });
}

function* loadUser(action) {
  try {
    const result = yield call(loadUserAPI, action.data);
    yield put({
      type: LOAD_USER_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_USER_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLoadUser() {
  yield takeLatest(LOAD_USER_REQUEST, loadUser);
}

/**
 * 실제로 서버에 요청을 보내는 함수
 */
function loginAPI(data) {
  return axios.post("/user/login", data);
}

/**
 * action
 * - LOGIN_REQUEST action 자체가 매개변수로 전달됨
 * - action.type : LOGIN_REQUEST
 * - action.data : LOGIN_DATA(id, password)
 * - yield call(함수, 매개변수)
 */
function* login(action) {
  /**
   * put
   * - dispatch 역할
   * - action을 dispatch함
   * call (동기 - blocking)
   * - const result = yield call(loginAPI);
   * - loginAPI가 return할때까지 기다려서 result에 넣어줌 (결과 값이 나올때까지 기다려줌)
   * : axios.post("/api/login").then((res) => {yield put({type; "LOGIN_SUCCESS", data: res.data})})
   * fork (비동기 - non blocking)
   * - const result = yield fork(loginAPI);
   * - loginAPI 요청 보내고 return 기다리지 않고 바로 다음 함수 실행 (결과 값을 기다리지 않음 -> 바로 다음줄)
   * : axios.post("/api/login")
   */
  try {
    console.log("saga Login");
    // yield delay(1000);
    const result = yield call(loginAPI, action.data);
    yield put({
      type: LOGIN_SUCCESS,
      // data: action.data,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOGIN_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLogin() {
  /**
   * take
   * - LOGIN 액션이 실행될때까지 기다리겠다
   * - LOGIN 액션이 실행되면 login 함수 실행함
   * - saga에서는 eventlistener 같은 느낌을 줌
   * - 치명적인 단점 : 일회용 (한번 실행되고 사라짐)
   *  ex) 로그인 -> 로그아웃 -> 로그인 (함수 사라짐)
   * - while(true) {yield take("LOGIN_REQUEST", login);} -> 동기적으로 실행
   * // 무한하게 실행됨
   * takeEvery
   * - 비동기 동작
   * - 무한 실행
   * takeLatest
   * - 클릭 실수로 2번 했을 때 마지막 요청을 실행함
   * - 동시에 로딩중인 것만 앞에 것들 취소함
   * - 완료된 것들은 건드리지 않음
   * - 응답을 취소하는 것이지 요청을 취소하는 것은 아님 (서버에서 요청이 2번온것 있는지 확인해야함)
   * throttle
   * - yield throttle("LOGIN_REQUEST", login, 2000);
   * : 2초동안 LOGIN_REQUEST는 1번만 실행 가능함
   * - 시간안에는 액션이 한번만 실행하게 하는 함수
   * => 대부분의 경우 takeLatest 사용 (서버에서 검증)
   * - 스크롤 할 때 많이 사용
   * - 마지막 함수가 호출 된 후 일정 시간이 지나기 전에 다시 호출되지 않도록 하는 것
   * debounce
   * - 연이어 호출되는 함수들 중 마지막 함수(또는 제일 처음)만 호출하도록 하는 것
   */
  //   yield take("LOGIN_REQUEST", login);
  //   yield takeEvery("LOGIN_REQUEST", login);
  //   yield throttle("LOGIN_REQUEST", login, 2000);
  yield takeLatest(LOGIN_REQUEST, login);
}

function logoutAPI() {
  return axios.post("/user/logout");
}

function* logout() {
  try {
    // const result = yield call(logoutAPI);
    /**
     * 서버가 없으므로 delay를 통해 비동기 효과
     */
    // yield delay(1000);
    yield call(logoutAPI);
    yield put({
      type: LOGOUT_SUCCESS,
      // data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOGOUT_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLogout() {
  yield takeLatest(LOGOUT_REQUEST, logout);
}

function signupAPI(data) {
  return axios.post("/user/signup", data);
}

function* signup(action) {
  try {
    // yield delay(1000);
    const result = yield call(signupAPI, action.data);
    console.log("Signup Result ", result);
    yield put({
      type: SIGNUP_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: SIGNUP_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchSignup() {
  yield takeLatest(SIGNUP_REQUEST, signup);
}

function followAPI(data) {
  return axios.patch(`/user/${data}/follow`);
}

function* follow(action) {
  try {
    // yield delay(1000);
    const result = yield call(followAPI, action.data);
    yield put({
      type: FOLLOW_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: FOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchFollow() {
  yield takeLatest(FOLLOW_REQUEST, follow);
}

function unfollowAPI(data) {
  return axios.delete(`/user/${data}/follow`);
}

function* unfollow(action) {
  try {
    const result = yield call(unfollowAPI, action.data);
    yield put({
      type: UNFOLLOW_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: UNFOLLOW_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchUnfollow() {
  yield takeLatest(UNFOLLOW_REQUEST, unfollow);
}

function changeNicknameAPI(data) {
  return axios.patch("/user/nickname", { nickname: data });
}

function* changeNickname(action) {
  try {
    const result = yield call(changeNicknameAPI, action.data);
    yield put({
      type: CHANGE_NICKNAME_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: CHANGE_NICKNAME_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchChangeNickname() {
  yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickname);
}

function loadFollowingAPI() {
  return axios.get("/user/followings");
}

function* loadFollowing() {
  try {
    const result = yield call(loadFollowingAPI);
    yield put({
      type: LOAD_FOLLOWINGS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_FOLLOWINGS_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLoadFollowing() {
  yield takeLatest(LOAD_FOLLOWINGS_REQUEST, loadFollowing);
}

function loadFollowersAPI() {
  return axios.get("/user/followers");
}

function* loadFollowers() {
  try {
    const result = yield call(loadFollowersAPI);
    yield put({
      type: LOAD_FOLLOWERS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error("error ", err);
    yield put({
      type: LOAD_FOLLOWERS_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLoadFollwer() {
  yield takeLatest(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}

function removeFollowerAPI(data) {
  return axios.delete(`/user/follower/${data}`);
}

function* removeFollower(action) {
  try {
    const result = yield call(removeFollowerAPI, action.data);
    yield put({
      type: REMOVE_FOLLOWER_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: REMOVE_FOLLOWER_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchRemoveFollower() {
  yield takeLatest(REMOVE_FOLLOWER_REQUEST, removeFollower);
}

export default function* userSaga() {
  yield all([
    fork(watchLoadUser),
    fork(watchLoadMyInfo),
    fork(watchLogin),
    fork(watchLogout),
    fork(watchSignup),
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchChangeNickname),
    fork(watchLoadFollowing),
    fork(watchLoadFollwer),
    fork(watchRemoveFollower),
  ]);
}
