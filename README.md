## What is MockMongoose?

[![Build Status](https://img.shields.io/travis/CSTLeagueORG/MockMongoose/mockgoose?logo=travis)](https://travis-ci.org/CSTLeagueORG/MockMongoose)
[![](https://img.shields.io/david/CSTLeagueORG/MockMongoose.svg?logo=dependabot)](https://github.com/cstleagueorg/mockmongoose/network/dependencies)
[![](https://img.shields.io/npm/v/mock-mongoose/latest.svg?logo=npm)](https://www.npmjs.com/package/mock-mongoose)
[![](https://img.shields.io/npm/v/mock-mongoose/mockgoose-legacy.svg?logo=npm)](https://www.npmjs.com/package/mock-mongoose)
[![](https://img.shields.io/github/license/CSTLeagueORG/MockMongoose.svg)](https://github.com/CSTLeagueORG/MockMongoose/blob/master/LICENSE)
[![](https://img.shields.io/github/release-date/CSTLeagueORG/MockMongoose.svg)](https://github.com/CSTLeagueORG/MockMongoose/releases)
[![](https://img.shields.io/github/contributors/CSTLeagueORG/MockMongoose.svg)](https://github.com/CSTLeagueORG/MockMongoose/graphs/contributors)

MockMongoose provides test database by spinning up mongod on the back when mongoose.connect call is made. By default it is using in memory store which does not have persistence.

## Install
To install the latest official version, use NPM:

```bash
npm install mock-mongoose --save-dev
```

## Usage
You simply require Mongoose and MockMongoose and wrap Mongoose with MockMongoose.

```javascript
var mongoose = require('mongoose');
var MockMongoose = require('mock-mongoose').MockMongoose;
var mockMongoose = new MockMongoose(mongoose);

mockMongoose.prepareStorage().then(function() {
	// mongoose connection		
});
```

Once Mongoose has been wrapped by MockMongoose connect() will be intercepted by MockMongoose so that no MongoDB instance is created.

## Mocha

Default mocha timeout is 2000ms, change it to two minutes.

```bash
mocha --timeout 120000
```

Same can be done by creating 'mocha.opts' file in your test directory with "--timeout 120000" entry.

### Example

```javascript
var Mongoose = require('mongoose').Mongoose;
var mongoose = new Mongoose();

var MockMongoose = require('mock-mongoose').MockMongoose;
var mockMongoose = new MockMongoose(mongoose);

before(function(done) {
	mockMongoose.prepareStorage().then(function() {
		mongoose.connect('mongodb://example.com/TestingDB', function(err) {
			done(err);
		});
	});
});

describe('...', function() {
	it("...", function(done) {
		// ...
		done();
	});
});
```

## ES6 Example without mocha

```javascript
import * as mongoose from 'mongoose';
import { MockMongoose } from 'mock-mongoose';

let mockMongoose: MockMongoose = new MockMongoose(mongoose);

mockMongoose.prepareStorage().then(() => {
	mongoose.connect('mongodb://foobar/baz');
	mongoose.connection.on('connected', () => {  
	  console.log('db connection is now open');
	}); 
});
```

## Helper methods and variables (mockMongoose.helper)

### reset(callback)
Reset method will remove **ALL** of the collections from a temporary store,
note that this method is part of **mock-mongoose** object, and not defined under
**mongoose**

```javascript
mockMongoose.helper.reset().then(() => {
	done()
});
```

### isMocked
Returns **TRUE** from **mongoose** object if MockMongoose is applied

```javascript
if ( mockMongoose.helper.isMocked() === true ) {
  // mongoose object is mocked
}
```

### setDbVersion(mongoDBVersion: string)
Set version of MongoDB release

```javascript
import * as mongoose from 'mongoose';
import { MockMongoose } from 'mock-mongoose';

let mockMongoose: MockMongoose = new MockMongoose(mongoose);
mockMongoose.helper.setDbVersion("3.2.1");

mockMongoose.prepareStorage().then(() => {
	mongoose.connect('mongodb://foobar/baz');
	mongoose.connection.on('connected', () => {  
	  console.log('db connection is now open');
	}); 
});
```

### setProxy(proxy: string)
Set proxy for downloading MongoDB release

```javascript
import * as mongoose from 'mongoose';
import { MockMongoose } from 'mock-mongoose';

let mockMongoose: MockMongoose = new MockMongoose(mongoose);

let proxy: string = process.env.http_proxy || 'http://example.com:8080';
mockMongoose.helper.setProxy(proxy);

mockMongoose.prepareStorage().then(() => {
	mongoose.connect('mongodb://foobar/baz');
	mongoose.connection.on('connected', () => {  
	  console.log('db connection is now open');
	}); 
});
```

## Development

This section contains instructions for developers working on the MockMongoose codebase.
It is not relevant if you just want to use MockMongoose as a library in your project.

### Pre-requisites

* Node.js >= 4

### Setup

```bash
git clone git@github.com:CSTLeagueORG/MockMongoose.git
cd MockMongoose
npm install
npm test
```
