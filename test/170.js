var mongoose = require('mongoose');
var path = require('path');
var MockMongoose = require(path.join(__dirname, '../built/mock-mongoose')).MockMongoose;
var expect = require('chai').expect;

var mockMongoose = new MockMongoose(mongoose);

// BUG: will not show `Cannot find module 'this-module-not-found'` error
describe('bug 170', function() {
	before(function(done) {
		mockMongoose.prepareStorage().then(function() {
			mongoose.connect('mongodb://foobar:27017/test', function() {
				done();	
			});
		});
	});
	it('should throw an error', function(done) {
		expect(function() {require('this-module-not-found')}).to.throw(/Cannot find module/);
		done();
	});

	after("Drop db",(done) => {
		mockMongoose.killMongo().then(function () {
			done();
		});
	});
});
