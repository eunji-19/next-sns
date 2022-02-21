/**
 * generator 함수
 * - const gen = function* (){}
 * saga
 * - effect 앞에는 항상 yield 붙여줌
 */
import { all, fork, take, call, put } from "redux-saga/effects";
import axios from "axios";

/**
 * 실제로 서버에 요청을 보내는 함수
 */
function loginAPI(data) {
  return axios.post("/api/login", data);
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
    const result = yield call(loginAPI, action.data);
    yield put({
      type: "LOGIN_SUCCESS",
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: "LOGIN_FAILURE",
      data: err.response.data,
    });
  }
}

function* watchLogin() {
  /**
   * take
   * - LOGIN 액션이 실행될때까지 기다리겠다
   * - LOGIN 액션이 실행되면 login 함수 실행함
   * - saga에서는 eventlistener 같은 느낌을 줌
   */
  yield take("LOGIN_REQUEST", login);
}

function logoutAPI() {
  return axios.post("/api/logout");
}

function* logout() {
  try {
    const result = yield call(logoutAPI);
    yield put({
      type: "LOGOUT_SUCCESS",
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: "LOGOUT_FAILURE",
      data: err.response.data,
    });
  }
}

function* watchLogout() {
  yield take("LOGOUT_REQUEST", logout);
}

function addPostAPI(data) {
  return axios.post("/api/post", data);
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);
    yield put({
      type: "ADD_POST_SUCCESS",
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: "ADD_POST_FAILURE ",
      data: err.response.data,
    });
  }
}

function* watchAddPost() {
  yield take("ADD_POST_REQUEST", addPost);
}

export default function* rootSaga() {
  /**
   * all
   * - 배열로 받은 것들을 한번에 실행시킴
   * fork
   * - 함수를 실행하는 것 (call과 다름)
   * - 비동기 함수 호출
   * call
   * - 동기 함수 호출
   */
  yield all([fork(watchLogin), fork(watchLogout), fork(watchAddPost)]);
}
