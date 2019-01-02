## What is Mockgoose?
[![Build Status](https://travis-ci.org/CSTLeagueORG/MockMongoose.svg?branch=master)](https://travis-ci.org/CSTLeagueORG/MockMongoose)
[![](https://img.shields.io/david/CSTLeagueORG/MockMongoose.svg)](https://www.npmjs.com/package/mock-mongoose)
[![](https://img.shields.io/github/license/CSTLeagueORG/MockMongoose.svg)](https://github.com/CSTLeagueORG/MockMongoose/blob/master/LICENSE)
[![](https://img.shields.io/npm/v/mock-mongoose/latest.svg)](https://www.npmjs.com/package/mock-mongoose)
[![](https://img.shields.io/npm/v/mock-mongoose/beta.svg)](https://www.npmjs.com/package/mock-mongoose)
[![](https://img.shields.io/github/release-date/CSTLeagueORG/MockMongoose.svg)](https://github.com/CSTLeagueORG/MockMongoose/releases)
[![](https://img.shields.io/github/contributors/CSTLeagueORG/MockMongoose.svg)](https://github.com/CSTLeagueORG/MockMongoose/graphs/contributors)

Mockgoose provides test database by spinning up mongod on the back when mongoose.connect call is made. By default it is using in memory store which does not have persistence.

## Install
To install the latest official version, use NPM:

```bash
npm install mock-mongoose --save-dev
```

## Usage
You simply require Mongoose and Mockgoose and wrap Mongoose with Mockgoose.

```javascript
var mongoose = require('mongoose');
var Mockgoose = require('mock-mongoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

mockgoose.prepareStorage().then(function() {
	// mongoose connection		
});
```

Once Mongoose has been wrapped by Mockgoose connect() will be intercepted by Mockgoose so that no MongoDB instance is created.

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

var Mockgoose = require('mock-mongoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

before(function(done) {
	mockgoose.prepareStorage().then(function() {
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
import {Mockgoose} from 'mock-mongoose';

let mockgoose: Mockgoose = new Mockgoose(mongoose);

mockgoose.prepareStorage().then(() => {
	mongoose.connect('mongodb://foobar/baz');
	mongoose.connection.on('connected', () => {  
	  console.log('db connection is now open');
	}); 
});
```

## Helper methods and variables (mockgoose.helper)

### reset(callback)
Reset method will remove **ALL** of the collections from a temporary store,
note that this method is part of **mockgoose** object, and not defined under
**mongoose**

```javascript
mockgoose.helper.reset().then(() => {
	done()
});
```

### isMocked
Returns **TRUE** from **mongoose** object if Mockgoose is applied

```javascript
if ( mockgoose.helper.isMocked() === true ) {
  // mongoose object is mocked
}
```

### setDbVersion(mongoDBVersion: string)
Set version of MongoDB release

```javascript
import * as mongoose from 'mongoose';
import {Mockgoose} from 'mock-mongoose';

let mockgoose: Mockgoose = new Mockgoose(mongoose);
mockgoose.helper.setDbVersion("3.2.1");

mockgoose.prepareStorage().then(() => {
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
import {Mockgoose} from 'mock-mongoose';

let mockgoose: Mockgoose = new Mockgoose(mongoose);

let proxy: string = process.env.http_proxy || 'http://example.com:8080';
mockgoose.helper.setProxy(proxy);

mockgoose.prepareStorage().then(() => {
	mongoose.connect('mongodb://foobar/baz');
	mongoose.connection.on('connected', () => {  
	  console.log('db connection is now open');
	}); 
});
```

## Development

This section contains instructions for developers working on the Mockgoose codebase.
It is not relevant if you just want to use Mockgoose as a library in your project.

### Pre-requisites

* Node.js >= 4

### Setup

```bash
git clone git@github.com:CSTLeagueORG/MockMongoose.git
cd MockMongoose
npm install
npm test
```