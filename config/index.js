exports = module.exports = function (app) {
  app.set("mongodb-url", "mongodb://localhost:27017/_db"); // Local
  app.set("tokenSecret", "someSecretWords");// Online
  app.set("passwordSalt", "passwordSalt");// Online
  app.set("port",process.env.PORT|| 4002)
}