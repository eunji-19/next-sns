import { createWrapper } from "next-redux-wrapper";
import { applyMiddleware, compose, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

/**
 * ConfigureStore.js
 * - npm i next-redux-wrapper@6
 * - npm i redux
 *
 * Redux 사용하는 이유
 * - 중앙 데이터 저장소 역할
 * - Component가 필요로 할때 데이터를 가져와 사용
 * - 비동기 요청
 * - Component : 화면 그리는 것에 집중 하는 것이 좋음 / 데이터 요청은 주로 안함
 * - {} === {} // false -> 객체를 새로 만든 것은 항상 false
 * - const a = {}; const b = a; a === b // true -> 객체를 참조, 참조관계가 있으면 true
 * - return {...state, age: action.data};
 * => 객체를 새로 만듦 -> 항상 false -> 내가 바꾸고싶은 것만 바꾸기 (age부분만 바꾸기) -> 나머지는 그대로 -> 대신 객체 자체는 새로 만들어서 보냄
 * -> 객체를 새로 만들어야 변경 내역들이 추적이 된다
 * - ..state 사용하는 이유
 * -> 메모리를 아끼기 위해서
 * -> 전의 객체가 참조가 된다
 *
 * Middleware
 * - enhancer 넣어서 설정 가능
 * - npm i redux-devtools-extension
 *   -> 브라우저 개발자 도구와 연동
 *
 */

import reducer from "../reducers";
import rootSaga from "../sagas";

import createSagaMiddleware from "redux-saga";

const loggerMiddleware =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    console.log("logger ", action);
    return next(action);
  };

const configureStore = () => {
  /**
   * Middleware
   * - redux 능력 향상
   * - redux-thunk : Redux가 비동기 기능을 할 수 있게 해줌
   * - 항상 3단 고차함수
   * ex) const loggerMiddleware = ({dispatch, getState}) => (next) => (action) => {return next(action);};
   */
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware, loggerMiddleware];
  const enhancer =
    process.env.NODE_ENV === "production"
      ? compose(applyMiddleware(...middlewares))
      : composeWithDevTools(applyMiddleware(...middlewares));

  const store = createStore(reducer, enhancer);
  store.sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};

const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === "development",
});

export default wrapper;
