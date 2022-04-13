// **  Initial State
const initialState = {
  userData: {},
  isUnAuth: true,
  loading: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        userData: action.data,
        [action.config.storageTokenKeyName]: action.config.storageTokenKeyName,
        [action.config.storageRefreshTokenKeyName]:
          action.config.storageRefreshTokenKeyName,
      };
      return {
        ...state,
        userData: action.data,
        [action.config.storageTokenKeyName]: action.config.storageTokenKeyName,
        [action.config.storageRefreshTokenKeyName]:
          action.config.storageRefreshTokenKeyName,
      };
    case "LOGOUT":
      const obj = { ...action };
      delete obj.type;
      return { ...state, userData: {}, ...obj };

    case "CHECK_AUTH":
      return {
        ...state,
        isUnAuth: action.data,
      };

    case "UI_LOADING":
      return {
        ...state,
        loading: action.data,
      };

    default:
      return state;
  }
};

export default authReducer;
