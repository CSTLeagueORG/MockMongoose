"use strict";


describe('issue 189 callback', function todoDescribe() {
  var Mongoose = require('mongoose').Mongoose;
  var MockMongoose = require('../built/mock-mongoose').MockMongoose;
  var mongoose = new Mongoose();
  var mockMongoose = new MockMongoose(mongoose);
  
  before(function(done) {
  	mockMongoose.prepareStorage().then(function() {
    	mongoose.connect('mongodb://localhost/mydb', function() {
    	    done(); 
    	});
	});
  });

  it('should call callback by reset', function(done) {
    mockMongoose.helper.reset().then(function(err) {
       done();
    });
  });

  it('should call callback by model create', function(done) {
    var SomeSchemaFactory= mongoose.Schema;
    var SomeSchema= new SomeSchemaFactory({
      item1: String,
      item2: String,
    });
    var MyModel= mongoose.model('MyModel', SomeSchema);
    var someDoc = {
      item1: String,
      item2: String,
    };
    MyModel.create(someDoc, done);
  });

  it('should work with empty callback', function(){
    mockMongoose.helper.reset();
  });

  after("Drop db",(done) => {
    mockMongoose.killMongo().then(function () {
      done();
    });
  });
});
