var Mongoose = require('mongoose').Mongoose;
var mongoose = new Mongoose();

var mockgoose = require('../../mockmongoose');
mockgoose(mongoose);

console.log("is mocked:", mongoose.isMocked);
var app = require('./app.js');

console.log('done in test');
