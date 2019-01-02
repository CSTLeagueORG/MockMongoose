"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Debug = require('debug');
var async_1 = require("async");
var httpsProxyAgent = require('https-proxy-agent');
var MockMongooseHelper = /** @class */ (function () {
    function MockMongooseHelper(mongoose, mockmongoose) {
        this.mongoose = mongoose;
        this.mockmongoose = mockmongoose;
        this.debug = Debug('MockMongooseHelper');
    }
    MockMongooseHelper.prototype.setDbVersion = function (version) {
        {
            this.mockmongoose.mongodHelper.mongoBin.mongoDBPrebuilt.mongoDBDownload.options.version = version;
        }
    };
    MockMongooseHelper.prototype.setProxy = function (proxy) {
        this.mockmongoose.mongodHelper.mongoBin.mongoDBPrebuilt.mongoDBDownload.options.http = {
            agent: new httpsProxyAgent(proxy)
        };
    };
    //TODO refactor this. It's too overengineered bullshit
    MockMongooseHelper.prototype.reset = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            async_1.each(_this.mongoose.connections, function (connection, callback) {
                // check if it is mockmongoose connection
                if (!/mockmongoose-temp-db-/.test(connection.name)) {
                    return callback();
                }
                if (connection.readyState !== 1) {
                    return callback();
                }
                connection.dropDatabase(function (err) {
                    callback();
                }, function (e) {
                    _this.debug("@reset err dropping database " + e);
                    callback();
                });
            }, function (err) {
                if (err) {
                    _this.debug("@reset err " + err);
                    reject();
                }
                else {
                    resolve();
                }
            });
        });
    };
    ;
    MockMongooseHelper.prototype.isMocked = function () {
        return this.mongoose.mocked;
    };
    return MockMongooseHelper;
}());
exports.MockMongooseHelper = MockMongooseHelper;
//# sourceMappingURL=../src/mock-mongoose-helper.js.map