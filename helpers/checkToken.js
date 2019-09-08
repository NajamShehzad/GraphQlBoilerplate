
exports = module.exports = function (app, mongoose) {

  //All Schemas Here 
  const jwt = require("jsonwebtoken");
  const { AuthenticationError } = require('apollo-server-express');


  async function checkToken(req) {
    const token = req.headers['x-token'];
    const dbName = req.headers['account'];
    // console.log(req.headers);
    console.log("Database Name here  ===>", dbName);
    if (token) {
      try {
        const LoggedInUsersModel = app.db.models.LoggedInUsers;
        const { userId, email, role } = await jwt.verify(token, app.get('tokenSecret'));
        let findedUser = await LoggedInUsersModel.findOne({ user: userId, token: token }).populate('user');
        if (!findedUser) {
          throw new AuthenticationError(
            'Your session expired. Sign in again.',
          );
        }
        return { userId, email, role, dbName, accounts: findedUser.user.accounts }
      } catch (e) {
        throw new AuthenticationError(
          'Your session expired. Sign in again.',
        );
      }
    }
    // return {nmae:"najam"}
  };

  app.graphql.checkToken = checkToken;

};


