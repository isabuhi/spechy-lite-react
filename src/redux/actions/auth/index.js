// ** UseJWT import to get config
import useJwt from "@src/auth/jwt/useJwt";
import jwt_decode from "jwt-decode";
import { getUserData } from "../../../auth/utils";
import { useHistory, useLocation } from "react-router-dom";
import { getSidebarMenu } from "../sidebarMenu";

const config = useJwt.jwtConfig;

// ** Handle User Login
export const handleLogin = (data) => {
  return (dispatch) => {
    dispatch({
      type: "LOGIN",
      data,
      config,
    });
  };
};

// ** Handle User Logout
export const handleLogout = () => {
  return (dispatch) => {
    useJwt.logout().then((res) => {
      if (res.status === 200) {
        dispatch({
          type: "LOGOUT",
          [config.storageTokenKeyName]: null,
          [config.storageRefreshTokenKeyName]: null,
        });
        useJwt.removeAuthInfos();
      }
    });
  };
};

export const ui_loading = (data) => {
  return (dispatch) => {
    dispatch({ type: "UI_LOADING", data });
  };
};

// Refresh Token and Refresh Token (f5)
export const checkAuth = () => {
  return (dispatch) => {
    const access_token = useJwt.getToken();
    const refresh_token = useJwt.getRefreshToken();
    if (access_token && refresh_token) {
      dispatch(ui_loading(true));
      useJwt
        .refreshToken()
        .then((res) => {
          if (res.data.data.access_token && res.data.data.refresh_token) {
            useJwt.setToken(res.data.data.access_token);
            useJwt.setRefreshToken(res.data.data.refresh_token);
            const decodedToken = jwt_decode(useJwt.getToken());
            dispatch(handleLogin(decodedToken));
            localStorage.setItem(
              "userData",
              JSON.stringify(res.data.data.user_data.menus)
            );

            dispatch(getSidebarMenu(getUserData()));
            dispatch(ui_loading(false));
          } else {
            window.location.href = "/login";
            useJwt.removeAuthInfos();
            dispatch(ui_loading(false));
          }
        })
        .catch(() => {
          window.location.href = "/login";
          useJwt.removeAuthInfos();
          dispatch(ui_loading(false));
        });
    } else {
      window.location.href = "/login";
      useJwt.removeAuthInfos();
    }
  };
};
