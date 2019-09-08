exports = module.exports = function (app, mongoose) {

  let Schema = mongoose.Schema;
  let SchemaTypes = mongoose.SchemaTypes;
  UserSchema = new Schema({
    fullName: {
      type: String,
      required: true
    },
    phoneNumber:{
      type: String,
      required:true
    }
  });

  app.db.model('User', UserSchema);
}