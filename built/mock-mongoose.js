"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
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
// @ts-ignore
var uuid_1 = require("uuid");
var MockMongoose = /** @class */ (function () {
    function MockMongoose(mongooseObj) {
        this.mongodHelper = new mongodb_prebuilt_1.MongodHelper();
        this.debug = Debug('MockMongoose');
        this.helper = new mock_mongoose_helper_1.MockMongooseHelper(mongooseObj, this);
        this.mongooseObj = mongooseObj;
        this.mongooseObj.mocked = true;
    }
    MockMongoose.prototype.prepareStorage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempDBPathPromise, openPortPromise, promiseValues, dbPath, openPort, storageEngine, mongodArgs, connectionString;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tempDBPathPromise = this.getTempDBPath();
                        openPortPromise = this.getOpenPort();
                        return [4 /*yield*/, Promise.all([tempDBPathPromise, openPortPromise])];
                    case 1:
                        promiseValues = _a.sent();
                        dbPath = promiseValues[0];
                        openPort = promiseValues[1].toString();
                        storageEngine = this.getMemoryStorageName();
                        mongodArgs = [
                            '--port', openPort,
                            '--storageEngine', storageEngine,
                            '--dbpath', dbPath
                        ];
                        this.debug("@prepareStorage mongod args, " + mongodArgs);
                        this.mongodHelper.mongoBin.commandArguments = mongodArgs;
                        return [4 /*yield*/, this.mongodHelper.run()];
                    case 2:
                        _a.sent();
                        connectionString = this.getMockConnectionString(openPort);
                        this.mockConnectCalls(connectionString);
                        return [2 /*return*/];
                }
            });
        });
    };
    MockMongoose.prototype.getMockConnectionString = function (port) {
        var dbName = 'mockmongoose-temp-db-' + uuid_1.v4();
        var connectionString = "mongodb://localhost:" + port + "/" + dbName;
        return connectionString;
    };
    MockMongoose.prototype.mockConnectCalls = function (connection) {
        var createConnection = new ConnectionWrapper('createConnection', this.mongooseObj, connection);
        this.mongooseObj.createConnection = function () { return createConnection.run(arguments); };
        var connect = new ConnectionWrapper('connect', this.mongooseObj, connection);
        this.mongooseObj.connect = function () { return connect.run(arguments); };
    };
    MockMongoose.prototype.getOpenPort = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, portfinder.getPortPromise({ port: 27017 })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // todo: add support to mongodb-download or prebuilt to return version
    MockMongoose.prototype.getMemoryStorageName = function () {
        return "ephemeralForTest";
    };
    MockMongoose.prototype.getTempDBPath = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tempDir;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tempDir = path.resolve(os.tmpdir(), "mockmongoose", Date.now().toString());
                        return [4 /*yield*/, fs.ensureDir(tempDir)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, tempDir];
                }
            });
        });
    };
    MockMongoose.prototype.killMongo = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.mongooseObj.connection.close()];
                    case 1:
                        _a.sent();
                        this.mongooseObj.mocked = false;
                        this.mongodHelper.mongoBin.childProcess.kill('SIGKILL');
                        return [2 /*return*/];
                }
            });
        });
    };
    return MockMongoose;
}());
exports.MockMongoose = MockMongoose;
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
//# sourceMappingURL=../src/mock-mongoose.js.map