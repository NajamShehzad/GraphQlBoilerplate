exports = module.exports = function (app, mongoose) {
  require('./User')(app, mongoose);
  require('./LoggedinUsers')(app, mongoose);
}