
var should = require('chai').should()
,expect = require('chai').expect
, Mongoose = require('mongoose').Mongoose
, mongoose = new Mongoose
, MockMongoose = require('../built/mock-mongoose').MockMongoose
, mockMongoose = new MockMongoose(mongoose)
, Cat = mongoose.model('Cat', { name: String });


describe('User functions', function() {
    before(function(done) {
		mockMongoose.prepareStorage().then(function() {
        	mongoose.connect('mongodb://localhost/TestingDB', function(err) {
        	    done(err);
        	}); 
		});
    });

    it("isMocked", function(done) {
		expect(mockMongoose.helper.isMocked()).to.be.true;
		done();
    });
    it("should create a cat foo", function(done) {
		Cat.create({name: "foo"}, function(err, cat) {
		    expect(err).to.be.null;
	            done(err);
		});
    });

    it("should find cat foo", function(done) {
    	Cat.findOne({name: "foo"}, function(err, cat) {
	    	expect(err).to.be.null;
			expect(cat.name).to.be.equal("foo");
    	    done(err);
    	});
    });

    it("should remove cat foo", function(done) {
    	Cat.deleteOne({name: "foo"}, function(err, cat) {
	    expect(err).to.be.null;
    	    done(err);
    	});
    });

    it("reset", function(done) {
    	mockMongoose.helper.reset().then(function() {
    	    done();
    	});
    });

	after("Drop db",(done) => {
		mockMongoose.killMongo().then(function () {
			done();
		});
	});
});
