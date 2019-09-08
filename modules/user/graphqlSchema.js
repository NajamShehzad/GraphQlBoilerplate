exports = module.exports = function (app, mongoose) {

  const { gql } = require('apollo-server-express');


  const typeDefs = gql`

  type User 
  {
    _id: String
    email: String
    firstName:String
    lastName:String
    title:String
    accounts:[String]
    token:String
    role:String
    phone1:String
    phone2:String
  }


  type UserResponse
  {
    message: String
    id: String
  }


  type token {
    token: String!
  }

  type Query {
    currentUser: User
    getallUsers: [User]
    login(email: String!, password: String!): User
  }

  type Mutation {
    addUser(email: String!, password: String!,firstName:String!,lastName:String!,title:String!,role:String!,accounts:[String],phone1:String!,phone2:String): User
    editUser(_id:String!,email: String!,title:String!,phone1:String!,phone2:String,firstName:String!,lastName:String!,role:String!,accounts:[String]): User
    # deleteUser(id: String!): UserResponse
  }

`;

  app.graphql.typeDefs.push(typeDefs);

}
