export default () => {
  return {
    port: process.env.PORT,
    mongoConnectionString: process.env.MONGO_CONNECTION_STRING,
    frontEndLoginUrl: process.env.FRONTEND_LOGIN_URL,
    authCookieName: process.env.AUTH_COOKIE_NAME,
  }
}