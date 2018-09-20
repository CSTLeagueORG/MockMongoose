"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Debug = require('debug');
// @ts-ignore
var portfinder = require("portfinder");
var os = require("os");
var path = require("path");
// @ts-ignore
var fs = require("fs-extra");
// @ts-ignore
var mongodb_prebuilt_1 = require("mongodb-prebuilt");
var mock_mongoose_helper_1 = require("./mock-mongoose-helper");
//const uuidV4 = require('uuid/v4');
var uuidV4 = require('uuid/v4');
var Mockgoose = /** @class */ (function () {
    function Mockgoose(mongooseObj) {
        this.mongodHelper = new mongodb_prebuilt_1.MongodHelper();
        this.debug = Debug('Mockgoose');
        this.helper = new mock_mongoose_helper_1.MockgooseHelper(mongooseObj, this);
        this.mongooseObj = mongooseObj;
        this.mongooseObj.mocked = true;
    }
    Mockgoose.prototype.prepareStorage = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var tempDBPathPromise = _this.getTempDBPath();
            var openPortPromise = _this.getOpenPort();
            Promise.all([tempDBPathPromise, openPortPromise]).then(function (promiseValues) {
                var dbPath = promiseValues[0];
                var openPort = promiseValues[1].toString();
                var storageEngine = _this.getMemoryStorageName();
                var mongodArgs = [
                    '--port', openPort,
                    '--storageEngine', storageEngine,
                    '--dbpath', dbPath
                ];
                _this.debug("@prepareStorage mongod args, " + mongodArgs);
                _this.mongodHelper.mongoBin.commandArguments = mongodArgs;
                _this.mongodHelper.run().then(function () {
                    var connectionString = _this.getMockConnectionString(openPort);
                    _this.mockConnectCalls(connectionString);
                    resolve();
                }, function (e) {
                    reject(e);
                    // throw e;
                    // return this.prepareStorage();
                });
            });
        });
    };
    Mockgoose.prototype.getMockConnectionString = function (port) {
        var dbName = 'mockgoose-temp-db-' + uuidV4();
        var connectionString = "mongodb://localhost:" + port + "/" + dbName;
        return connectionString;
    };
    Mockgoose.prototype.mockConnectCalls = function (connection) {
        var createConnection = new ConnectionWrapper('createConnection', this.mongooseObj, connection);
        this.mongooseObj.createConnection = function () { return createConnection.run(arguments); };
        var connect = new ConnectionWrapper('connect', this.mongooseObj, connection);
        this.mongooseObj.connect = function () { return connect.run(arguments); };
    };
    Mockgoose.prototype.getOpenPort = function () {
        return new Promise(function (resolve, reject) {
            portfinder.getPort({ port: 27017 }, function (err, port) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(port);
                }
            });
        });
    };
    // todo: add support to mongodb-download or prebuilt to return version
    Mockgoose.prototype.getMemoryStorageName = function () {
        return "ephemeralForTest";
    };
    Mockgoose.prototype.getTempDBPath = function () {
        return new Promise(function (resolve, reject) {
            var tempDir = path.resolve(os.tmpdir(), "mockgoose", Date.now().toString());
            fs.ensureDir(tempDir, function (err) {
                if (err)
                    throw err;
                resolve(tempDir);
            });
        });
    };
    Mockgoose.prototype.killMongo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.mongooseObj.connection.close()];
                    case 1:
                        _a.sent();
                        this.mongodHelper.mongoBin.childProcess.kill('SIGKILL');
                        return [2 /*return*/];
                }
            });
        });
    };
    return Mockgoose;
}());
exports.Mockgoose = Mockgoose;
var ConnectionWrapper = /** @class */ (function () {
    function ConnectionWrapper(functionName, mongoose, connectionString) {
        this.functionName = functionName;
        this.mongoose = mongoose;
        this.functionCode = mongoose[functionName];
        this.connectionString = connectionString;
    }
    ConnectionWrapper.prototype.run = function (args) {
        this.originalArguments = args;
        var mockedArgs = args;
        mockedArgs[0] = this.connectionString;
        return this.functionCode.apply(this.mongoose, mockedArgs);
    };
    return ConnectionWrapper;
}());
exports.ConnectionWrapper = ConnectionWrapper;
//# sourceMappingURL=C:/Users/PolarWolf/Documents/Mockgoose/mock-mongoose.js.map