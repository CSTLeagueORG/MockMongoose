var mongoose = require('mongoose');
var path = require('path');
var MockMongoose = require('../built/mock-mongoose').MockMongoose;
var expect = require('chai').expect;
var mockMongoose = new MockMongoose(mongoose);
var CatSchema = new mongoose.Schema({name: String});
var Cat1;
var Cat2;

// create connection to first database
describe('bug 15', function() {
  
  before("DB1 connection", (done) => {
    mockMongoose.prepareStorage().then(function() {
      var db1 = mongoose.createConnection("mongodb://barbaz", (err, res) => {
        if (err) throw err;
        Cat1 = db1.model('Cat', CatSchema);
        done(err);
      });
    }, function(e) {
      done(e);
    });
  }); 
  
  // create connection to second database
  before("DB2 connection", (done) => {
    mockMongoose.prepareStorage().then(function() {
      var db2 = mongoose.createConnection("mongodb://foobar", (err, res) => {
        if (err) throw err;
        Cat2 = db2.model('Cat', CatSchema);
        done(err);
      });
    }, function(e) {
      done(e);
    });
  });
  
  it("should create a cat foo", function(done) {
    Cat1.create({
      name: "foo"
    }, function(err, cat) {
      expect(err).to.be.null;
      done(err);
    });
  });
  
  it("should find cat foo", function(done) {
    Cat1.findOne({name: "foo"}, function(err, cat) {
      expect(err).to.be.null;
      done(err);
    });
  });
  
  // remove collections from a temporary store
  after("Drop db",(done) => {
    // Here is when the error is trigged
    mockMongoose.helper.reset().then(function() {
      mockMongoose.killMongo().then(function () {
        done();
      });
    });
  });
});