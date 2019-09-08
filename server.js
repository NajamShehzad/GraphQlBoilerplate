const express = require('express');
const cors = require('cors');
const { ApolloServer, mergeSchemas } = require('apollo-server-express');
const app = express();
const mongoose = require('mongoose');

app.models={}
app.graphql = {}
app.graphql.typeDefs = [];
app.graphql.resolvers = [];


require('./config')(app);
require('./db')(app, mongoose);
require('./models')(app, mongoose);
require('.//helpers')(app, mongoose);
require('./modules')(app, mongoose);
const { mergeTypes, mergeResolvers } = require('merge-graphql-schemas');

const typeDefs = app.graphql.typeDefs;
const resolvers = app.graphql.resolvers;

// Create Apollo server
const server = new ApolloServer({
  typeDefs: mergeTypes(typeDefs),
  resolvers: mergeResolvers(resolvers),
  // context: async ({ req,res }) => {
  //   let currentUser =  await app.graphql.checkToken(req,res);
  //   // console.log("final answer ==>",currentUser);
  //   // console.log("Hereee ==>");
  //   return ({
  //     currentUser
  //   })
  // }
});

app.get('/game',(req,res,next)=>{
  res.send({message:"Hello world"})
})

// Create Express app
app.use(cors());
// Use Express app as middleware in Apollo Server instance
server.applyMiddleware({ app });

// Listen server
app.listen({ port: app.get('port') }, () =>
  console.log(`🚀Server ready at http://localhost:4000${server.graphqlPath}`)
);
