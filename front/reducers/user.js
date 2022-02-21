export const initialState = {
  isLoggedIn: false,
  me: null,
  signupData: {},
  loginData: {},
};

// action creator
// export const loginAction = (data) => {
//   return {
//     type: "LOGIN",
//     data,
//   };
// };

export const logoutAction = () => {
  return {
    type: "LOGOUT",
  };
};

/**
 * redux-thunk를 활용한 비동기 예시
 * - 함수를 리턴하는 비동기 액션 creator가 추가됨
 * - state: initialState 호출 됨 (index, user, post)
 * - 한번에 dispatch를 여러번 할 수 있게 해줌
 * - delay 같은 경우 js를 이용해 직접 구현해줘야 함
 * setTimeout(() => {dispatch(loginRequestAction();)},2000);
 * - 클릭 2번 하면 2번 다 요청감 (단점)
 */
export const loginAction = (data) => {
  return (dispatch, getState) => {
    const state = getState();
    dispatch(loginRequestAction());
    axios
      .post("/api/login")
      .then((res) => {
        dispatch(loginSuccessAction(res.data));
      })
      .catch((err) => {
        dispatch(loginFailureAction(err));
      });
  };
};

export const loginRequestAction = (data) => {
  return {
    type: "LOGIN_REQUEST",
    data,
  };
};

export const loginSuccessAction = (data) => {
  return {
    type: "LOGIN_SUCCESS",
    data,
  };
};

export const loginFailureAction = (data) => {
  return {
    type: "LOGIN_FAILURE",
    data,
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isLoggedIn: true,
        me: action.data,
      };
    case "LOGOUT":
      return {
        ...state,
        isLoggedIn: false,
        me: null,
      };
    default:
      return state;
  }
};

export default reducer;
