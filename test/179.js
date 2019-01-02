var should = require('chai').should();
var expect = require('chai').expect;
var Mongoose = require('mongoose').Mongoose;
var mongoose = new Mongoose;
var MockMongoose = require('../built/mock-mongoose').MockMongoose;
var mockMongoose = new MockMongoose(mongoose);

var Cat = mongoose.model('Cat', {
    name: String
});


describe('issue 179', function() {
    before(function(done) {
		mockMongoose.prepareStorage().then(function() {
        	mongoose.connect('mongodb://127.0.0.1:27017/TestingDB', function(err) {
        	    done(err);
        	});
		});
    });

    beforeEach(function(done) {
        mockMongoose.helper.reset().then(function() {
            done();
        });
    });

    it("should create a cat foo", function(done) {
        Cat.create({
            name: "foo"
        }, function(err, cat) {
            expect(err).to.be.null;
            done(err);
        });
    });

    it("should NOT find cat foo", function(done) {
        Cat.findOne({
            name: "foo"
        }, function(err, cat) {
            expect(err).to.be.null;
            expect(cat).to.be.null;
            done(err);
        });
    });

    after("Drop db",(done) => {
        mockMongoose.killMongo().then(function () {
            done();
        });
    });
});
