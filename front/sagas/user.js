import { all, fork, takeLatest, delay, put } from "redux-saga/effects";
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
    // const result = yield call(loginAPI, action.data);
    console.log("saga Login");
    yield delay(1000);
    yield put({
      type: "LOGIN_SUCCESS",
      data: action.data,
      //   data: result.data,
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
  yield takeLatest("LOGIN_REQUEST", login);
}

function logoutAPI() {
  return axios.post("/api/logout");
}

function* logout() {
  try {
    // const result = yield call(logoutAPI);
    /**
     * 서버가 없으므로 delay를 통해 비동기 효과
     */
    yield delay(1000);
    yield put({
      type: "LOGOUT_SUCCESS",
      //   data: result.data,
    });
  } catch (err) {
    yield put({
      type: "LOGOUT_FAILURE",
      data: err.response.data,
    });
  }
}

function* watchLogout() {
  yield takeLatest("LOGOUT_REQUEST", logout);
}

function* signup(action) {
  try {
    yield delay(1000);
    yield put({
      type: "SIGNUP_SUCCESS",
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: "SIGNUP_FAILURE",
    });
  }
}

function* watchSignup() {
  yield takeLatest("SIGNUP_REQUEST", signup);
}

export default function* userSaga() {
  yield all([fork(watchLogin), fork(watchLogout), fork(watchSignup)]);
}
