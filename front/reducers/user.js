export const initialState = {
  isLoggingIn: false, // 로그인 시도중 (로딩)
  isLoggedIn: false,
  isLoggingOut: false, // 로그아웃 시도중
  me: null,
  isSigningUp: false,
  // signupData: {},
  signupData: null,
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

export const signupRequestAction = (data) => {
  return {
    type: "SIGNUP_REQUEST",
    data,
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
    case "SIGNUP_REQUEST":
      return {
        ...state,
        isSigningUp: true,
      };
    case "SIGNUP_SUCCESS":
      return {
        ...state,
        isSigningUp: false,
        isLoggedIn: false,
        signupData: action.data,
      };
    case "SIGNUP_FAILURE":
      return {
        ...state,
        isSigningUp: false,
      };
    default:
      return state;
  }
};

export default reducer;
