export default () => {
  const isProduction = process.env['NODE' + '_ENV'] === 'production';
  return {
    port: process.env.PORT,
    mongoConnectionString: process.env.MONGO_CONNECTION_STRING,
    frontEndLoginUrl: process.env.FRONTEND_LOGIN_URL,
    authCookieName: process.env.AUTH_COOKIE_NAME,
    jwtSecret: process.env.JWT_SECRET,
    isLocal: !isProduction,
  };
}