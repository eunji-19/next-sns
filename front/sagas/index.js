/**
 * generator 함수
 * - const gen = function* (){}
 * saga
 * - effect 앞에는 항상 yield 붙여줌
 */
import { all, fork } from "redux-saga/effects";
import axios from "axios";
import postSaga from "./post";
import userSaga from "./user";

// axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.baseURL = "http://3.95.136.155:4000/";
axios.defaults.withCredentials = true;

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
  yield all([fork(userSaga), fork(postSaga)]);
}
