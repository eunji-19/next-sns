import produce from "immer";

export const initialState = {
  loginLoading: false, // 로그인 시도중 (로딩)
  loginDone: false,
  loginError: null,
  logoutLoading: false, // 로그아웃 시도중
  logoutDone: false,
  logoutError: null,
  signupLoading: false, // 회원가입 시도중
  signupDone: false,
  signupError: null,
  changeNicknameLoading: false, // 닉네임 변경 시도중
  changeNicknameDone: false,
  changeNicknameError: null,
  followLoading: false, // 팔로우 시도중
  followDone: false,
  followError: null,
  unfollowLoading: false, // 언팔로우 시도중
  unfollowDone: false,
  unfollowError: null,
  me: null,
  // signupData: {},
  signupData: null,
  loginData: {},
};

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const LOGOUT_REQUEST = "LOGOUT_REQUEST";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_FAILURE = "LOGOUT_FAILURE";

export const SIGNUP_REQUEST = "SIGNUP_REQUEST";
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const SIGNUP_FAILURE = "SIGNUP_FAILURE";

export const CHANGE_NICKNAME_REQUEST = "CHANGE_NICKNAME_REQUEST";
export const CHANGE_NICKNAME_SUCCESS = "CHANGE_NICKNAME_SUCCESS";
export const CHANGE_NICKNAME_FAILURE = "CHANGE_NICKNAME_FAILURE";

export const FOLLOW_REQUEST = "FOLLOW_REQUEST";
export const FOLLOW_SUCCESS = "FOLLOW_SUCCESS";
export const FOLLOW_FAILURE = "FOLLOW_FAILURE";

export const UNFOLLOW_REQUEST = "UNFOLLOW_REQUEST";
export const UNFOLLOW_SUCCESS = "UNFOLLOW_SUCCESS";
export const UNFOLLOW_FAILURE = "UNFOLLOW_FAILURE";

export const ADD_POST_TO_ME = "ADD_POST_TO_ME";
export const REMOVE_POST_FROM_ME = "REMOVE_POST_FROM_ME";

// action creator
export const loginRequestAction = (data) => {
  return {
    type: LOGIN_REQUEST,
    data,
  };
};

export const logoutRequestAction = () => {
  return {
    type: LOGOUT_REQUEST,
  };
};

export const signupRequestAction = (data) => {
  return {
    type: SIGNUP_REQUEST,
    data,
  };
};

const dummyUser = (data) => ({
  data,
  nickname: "Jin",
  id: 1,
  Posts: [{ id: 1 }],
  Followings: [{ nickname: "RM" }, { nickname: "J-Hope" }, { nickname: "JK" }],
  Followers: [{ nickname: "sugar" }, { nickname: "Jimin" }, { nickname: "V" }],
});

/**
 * saga와 맞춤
 */
const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case LOGIN_REQUEST:
        draft.loginLoading = true;
        draft.loginDone = false;
        draft.loginError = null;
        break;
      case LOGIN_SUCCESS:
        draft.loginLoading = false;
        draft.loginDone = true;
        draft.loginError = null;
        draft.me = action.data;
        // draft.me = dummyUser(action.data);
        break;
      case LOGIN_FAILURE:
        draft.loginLoading = false;
        draft.loginDone = false;
        draft.loginError = action.error;
        break;
      case LOGOUT_REQUEST:
        draft.logoutLoading = true;
        draft.logoutDone = false;
        draft.logoutError = null;
        break;
      case LOGOUT_SUCCESS:
        draft.logoutLoading = false;
        draft.logoutDone = false;
        draft.logoutError = null;
        draft.me = null;
        break;
      case LOGOUT_FAILURE:
        draft.logoutLoading = false;
        draft.logoutError = action.error;
        break;
      case SIGNUP_REQUEST:
        draft.signupLoading = true;
        draft.signupDone = false;
        draft.signupError = null;
        break;
      case SIGNUP_SUCCESS:
        draft.signupLoading = false;
        draft.signupDone = true;
        draft.signupError = null;
        draft.signupData = action.data;
        break;
      case SIGNUP_FAILURE:
        draft.signupLoading = false;
        draft.signupError = action.error;
        break;
      case CHANGE_NICKNAME_REQUEST:
        draft.changeNicknameLoading = true;
        draft.changeNicknameDone = false;
        draft.changeNicknameError = null;
        break;
      case CHANGE_NICKNAME_SUCCESS:
        draft.changeNicknameLoading = false;
        draft.changeNicknameDone = true;
        draft.changeNicknameError = null;
        draft.changeNicknameData = action.data;
        break;
      case CHANGE_NICKNAME_FAILURE:
        draft.changeNicknameLoading = false;
        draft.changeNicknameError = action.error;
        break;
      case ADD_POST_TO_ME:
        draft.me.Posts.unshift({ id: action.data });
        break;
      // return {
      //   ...state,
      //   me: {
      //     ...state.me,
      //     Posts: [{ id: action.data }, ...state.me.Posts],
      //   },
      // };
      case REMOVE_POST_FROM_ME:
        // action.data === id
        draft.me.Posts = draft.me.Posts.filter(
          (value) => value !== action.data
        );
        break;
      // return {
      //   ...state,
      //   me: {
      //     ...state.me,
      //     Posts: state.me.Posts.filter((value) => value !== action.data),
      //   },
      // };
      case FOLLOW_REQUEST:
        draft.followLoading = true;
        draft.followDone = false;
        draft.followError = null;
        break;
      case FOLLOW_SUCCESS:
        draft.followLoading = false;
        draft.followDone = true;
        draft.followError = null;
        draft.me.Following.push({ id: action.data });
        break;
      case FOLLOW_FAILURE:
        draft.followLoading = false;
        draft.followDone = false;
        draft.followError = action.error;
        break;
      case UNFOLLOW_REQUEST:
        draft.unfollowLoading = true;
        draft.unfollowDone = false;
        draft.unfollowError = null;
        break;
      case UNFOLLOW_SUCCESS:
        draft.unfollowLoading = false;
        draft.unfollowDone = true;
        draft.unfollowError = null;
        draft.me.Following = draft.me.Following.filter(
          (value) => value.id !== action.data
        );
        break;
      case UNFOLLOW_FAILURE:
        draft.unfollowLoading = false;
        draft.unfollowDone = false;
        draft.unfollowError = action.error;
        break;
      default:
        break;
    }
  });
};

export default reducer;
