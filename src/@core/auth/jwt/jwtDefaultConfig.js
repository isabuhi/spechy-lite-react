// ** Auth Endpoints
export default {
  loginEndpoint: 'api/auth/login',
  registerEndpoint: 'api/auth/register',
  refreshEndpoint: 'api/auth/refresh',
  logoutEndpoint: 'api/auth/logout',

  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'access_token',
  storageRefreshTokenKeyName: 'refresh_token'
}
