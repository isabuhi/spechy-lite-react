import axios from "axios";
import jwtDefaultConfig from "./jwtDefaultConfig";
import { useHistory, useLocation } from "react-router-dom";

export const BASE_URL = "https://app.spechy.com:8000";

export default class JwtService {
  // ** jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig };

  // ** For Refreshing Token
  isAlreadyFetchingAccessToken = false;

  // ** For Refreshing Token
  subscribers = [];

  constructor(jwtOverrideConfig) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig };
    axios.defaults.baseURL = "https://app.spechy.com:8000";

    // ** Request Interceptor
    axios.interceptors.request.use(
      (config) => {
        // ** Get token from localStorage
        const accessToken = this.getToken();
        // ** If token is present add it to request's Authorization Header
        if (accessToken) {
          // ** eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // ** Add request/response interceptor
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // ** const { config, response: { status } } = error
        const { config, response } = error;
        const originalRequest = config;
        axios.defaults.baseURL = "https://app.spechy.com:8000";

        //console.log('fuc', accessToken)
        // ** if (status === 401) {
        if (response && response.status === 401) {
          if (!this.isAlreadyFetchingAccessToken) {
            this.isAlreadyFetchingAccessToken = true;
            this.refreshToken().then((r) => {
              this.isAlreadyFetchingAccessToken = false;

              // ** Update accessToken in localStorage
              this.setToken(r.data.accessToken);
              this.setRefreshToken(r.data.refreshToken);

              this.onAccessTokenFetched(r.data.accessToken);
            });
            if (this.isAlreadyFetchingAccessToken === true) {
              const history = useHistory();
              this.logout();
              this.removeAuthInfos();
              history.push("/login");
            }
            console.log(this.isAlreadyFetchingAccessToken);
          }
          const retryOriginalRequest = new Promise((resolve) => {
            this.addSubscriber((accessToken) => {
              // ** Make sure to assign accessToken according to your response.
              // ** Check: https://pixinvent.ticksy.com/ticket/2413870
              // ** Change Authorization header
              if (accessToken !== null) {
                originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`;
                resolve(this.axios(originalRequest));
              }
            });
          });
          return retryOriginalRequest;
        } else {
          return Promise.reject(error);
        }
      }
    );
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter((callback) =>
      callback(accessToken)
    );
  }

  addSubscriber(callback) {
    this.subscribers.push(callback);
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName);
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName);
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value);
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value);
  }

  login(...args) {
    return axios.post(this.jwtConfig.loginEndpoint, ...args);
  }
  logout() {
    //localStorage.clear()
    return axios.get(this.jwtConfig.logoutEndpoint);
  }

  register(...args) {
    return axios.post(this.jwtConfig.registerEndpoint, ...args);
  }

  refreshToken() {
    return axios.post(this.jwtConfig.refreshEndpoint, {
      refresh_token: this.getRefreshToken(),
    });
  }

  removeAuthInfos() {
    localStorage.clear();
  }

  removeAuthInfosSpechy() {
    localStorage.clear();
  }
}
