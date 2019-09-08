exports = module.exports = function (app, mongoose) {

 require('./checkToken')(app,mongoose)
 require('./authentication')(app,mongoose)

};
