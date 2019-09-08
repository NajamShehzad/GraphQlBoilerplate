exports = module.exports = function (app, mongoose) {

  const { SHA256 } = require('crypto-js');
  const jwt = require("jsonwebtoken");

  const { UserInputError, AuthenticationError, ForbiddenError } = require('apollo-server-express');


  const UserModel = app.db.models.User;



  const resolvers =
  {

    Query:
    {
      login: async (parent, obj, context) => {
        try {
          console.log("Obj is here ==>", obj);

          let hashedPassword = SHA256(JSON.stringify(obj.password) + app.get('passwordSalt')).toString()
          let findedUser = await UserModel.findOne({ email: obj.email, password: hashedPassword });
          if (!findedUser) {
            return new AuthenticationError('email or passowrd is not correct');
          }
          console.log(findedUser);

          let token = await saveTokenInLoginUsers(findedUser);
          let responseObj = { ...JSON.parse(JSON.stringify(findedUser)), token }
          return responseObj;
        } catch (err) {
          return Error(err.message)
        }
      },
      getallUsers: async (parent, obj, context) => {
        try {
          const { currentUser } = context;
          console.log("Current Account here ==>", currentUser);
          if (currentUser.role == "superadmin") {
            const allUsersArray = await UserModel.find({});
            return allUsersArray;
          } else {
            let findedUsers = await UserModel.find({ accounts: { $in: currentUser.accounts } });
            console.log("Finded Accounts here ====>>", findedUsers);

            return findedUsers;
          }
        } catch (err) {
          return Error(err.message)
        }
      }
    },


    Mutation:
    {
      addUser: async (parent, obj, context) => {
        try {
          const userObj = {
            firstName: obj.firstName,
            lastName: obj.lastName,
            title: obj.title,
            email: obj.email,
            password: SHA256(JSON.stringify(obj.password) + app.get('passwordSalt')).toString(),
            role: obj.role,
            accounts: obj.accounts || [],
            phone1: obj.phone1,
            phone2: obj.phone2 || ""
          };
          console.log("Obj to saved ==>", userObj);
          const newItem = new UserModel(userObj);
          const savedUser = await newItem.save();
          return savedUser
        } catch (err) {
          console.log("Code herer ==>", err.code);
          if (err.code == 11000) {
            return Error("Provided Email is aleady in use");
          } else {
            return Error(err.message);
          }
        }
      },
      editUser: async (parent, obj, context) => {
        try {
          console.log("Obj here===>", obj)
          const userObj = {
            firstName: obj.firstName,
            lastName: obj.lastName,
            title: obj.title,
            email: obj.email,
            role: obj.role,
            accounts: obj.accounts || [],
            phone1: obj.phone1,
            phone2: obj.phone2 || ""
          };
          const updatedUser = await UserModel.findOneAndUpdate({ _id: obj._id }, { $set: userObj }, { new: true });
          if (!updatedUser) {
            return new UserInputError('No user found please check _Id');
          }
          return updatedUser
        } catch (err) {
          console.log("Code herer ==>", err.code);
          if (err.code == 11000) {
            return Error("Provided Email is aleady in use");
          } else {
            return Error(err.message);
          }
        }
      }
    }
  };


  app.graphql.resolvers.push([resolvers]);





  async function saveTokenInLoginUsers(userObj) {
    return new Promise(async (resolve, reject) => {
      try {

        const token = jwt.sign(
          { userId: userObj._id, email: userObj.email, role: userObj.role },
          app.get('tokenSecret')
        );
        let ObjTosave = {
          user: userObj._id,
          token: token
        };
        console.log("hereeeeee");

        const LoggedInModel = new app.db.models.LoggedInUsers(ObjTosave)
        let savedToken = await LoggedInModel.save();
        resolve(savedToken.token)
      } catch (err) {
        reject(err)
      }
    })
  }


}

