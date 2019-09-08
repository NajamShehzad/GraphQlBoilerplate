exports = module.exports = function (app, mongoose) {

  let Schema = mongoose.Schema;
  let SchemaTypes = mongoose.SchemaTypes;
  LoggedInUsers = new Schema({
    user: {
      type: SchemaTypes.ObjectId,
      ref: 'User'
    },
    token: {
      type: [String]
    }
  });

  app.db.model('LoggedInUsers', LoggedInUsers);
}