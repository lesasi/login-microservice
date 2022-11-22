export default () => {
  return {
    port: process.env.PORT,
    mongoConnectionString: process.env.MONGO_CONNECTION_STRING
  }
}