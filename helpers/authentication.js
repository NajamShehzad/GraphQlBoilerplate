
exports = module.exports = function (app, mongoose) {

  const { ForbiddenError } = require("apollo-server-express");
  const { skip } = require("graphql-resolvers");

  const isAuthenticated = (parent, args, { user }) =>
    me ? skip : new ForbiddenError("Not authenticated as user.");

  app.graphql.isAuthenticated = isAuthenticated;

};


