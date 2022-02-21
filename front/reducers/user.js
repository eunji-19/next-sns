export const initialState = {
  isLoggingIn: false, // 로그인 시도중 (로딩)
  isLoggedIn: false,
  isLoggingOut: false, // 로그아웃 시도중
  me: null,
  signupData: {},
  loginData: {},
};

// action creator
export const loginRequestAction = (data) => {
  return {
    type: "LOGIN_REQUEST",
    data,
  };
};

export const logoutRequestAction = () => {
  return {
    type: "LOGOUT_REQUEST",
  };
};

/**
 * saga와 맞춤
 */
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_REQUEST":
      console.log("reducer Login");
      return {
        ...state,
        isLoggingIn: true,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: true,
        me: { ...action.data, nickname: "eunjiCho" },
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: false,
      };
    case "LOGOUT_REQUEST":
      return {
        ...state,
        isLoggingOut: true,
      };
    case "LOGOUT_SUCCESS":
      return {
        ...state,
        isLoggingOut: false,
        isLoggedIn: false,
        me: null,
      };
    case "LOGOUT_FAILURE":
      return {
        ...state,
        isLoggingOut: false,
      };
    default:
      return state;
  }
};

export default reducer;
