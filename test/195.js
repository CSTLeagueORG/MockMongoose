"use strict";

var expect = require('chai').expect;

describe('issue 195 callback', function todoDescribe() {
  var Mongoose = require('mongoose').Mongoose;
  var MockMongoose = require('../built/mock-mongoose').MockMongoose;
  var mongoose = new Mongoose();
  var mockMongoose = new MockMongoose(mongoose);
  
  it('should return native connection object', function(done) {
  	mockMongoose.prepareStorage().then(function() {
    	    var connection = mongoose.createConnection('mongodb://localhost/mydb');
            expect(typeof connection).to.equal('object'); 
            expect(connection.constructor.name).to.equal('NativeConnection'); 
            done();
	});
  });

    after("Drop db",(done) => {
        mockMongoose.killMongo().then(function () {
            done();
        });
    });
});
