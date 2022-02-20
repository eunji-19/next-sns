export const initialState = {
  isLoggedIn: false,
  me: null,
  signupData: {},
  loginData: {},
};

// action creator
export const loginAction = (data) => {
  return {
    type: "LOGIN",
    data,
  };
};

export const logoutAction = () => {
  return {
    type: "LOGOUT",
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
