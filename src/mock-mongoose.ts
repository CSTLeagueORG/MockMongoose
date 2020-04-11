const Debug: any = require('debug');
// @ts-ignore
import * as portfinder from 'portfinder';
import * as os from 'os';
import * as path from 'path';
// @ts-ignore
import * as fs from 'fs-extra';
// @ts-ignore
import {MongodHelper} from 'mongodb-prebuilt';
import {MockMongooseHelper} from './mock-mongoose-helper';
import {Mongoose} from 'mongoose';
//const uuidV4 = require('uuid/v4');
// @ts-ignore
import { v4 as uuidV4 } from 'uuid';

export class MockMongoose {

  helper: MockMongooseHelper;
  mongodHelper: MongodHelper = new MongodHelper();
  debug: any;
  mongooseObj: any;

  constructor(mongooseObj: any) {
    this.debug = Debug('MockMongoose');
    this.helper = new MockMongooseHelper(mongooseObj, this);

    this.mongooseObj = mongooseObj;
    this.mongooseObj.mocked = true;
  }

  async prepareStorage(): Promise<void> {
    let tempDBPathPromise: Promise<string> = this.getTempDBPath();
    let openPortPromise: Promise<number> = this.getOpenPort();

    let promiseValues = await Promise.all([tempDBPathPromise, openPortPromise]);
    let dbPath: string = promiseValues[0];
    let openPort: string = promiseValues[1].toString();
    let storageEngine: string = this.getMemoryStorageName();
    let mongodArgs: string[] = [
      '--port', openPort,
      '--storageEngine', storageEngine,
      '--dbpath', dbPath
    ];
    this.debug(`@prepareStorage mongod args, ${mongodArgs}`);
    this.mongodHelper.mongoBin.commandArguments = mongodArgs;
    await this.mongodHelper.run();
    let connectionString: string = this.getMockConnectionString(openPort);
    this.mockConnectCalls(connectionString);
  }

  getMockConnectionString(port: string): string {
    const dbName: string = 'mockmongoose-temp-db-' + uuidV4();
    const connectionString: string = `mongodb://localhost:${port}/${dbName}`;
    return connectionString;
  }

  mockConnectCalls(connection: string) {
    let createConnection: ConnectionWrapper = new ConnectionWrapper('createConnection', this.mongooseObj, connection);
    this.mongooseObj.createConnection = function() { return createConnection.run(arguments) };
    let connect: ConnectionWrapper = new ConnectionWrapper('connect', this.mongooseObj, connection);
    this.mongooseObj.connect = function() { return connect.run(arguments) };
  }

  async getOpenPort(): Promise<number> {
    return await portfinder.getPortPromise({port: 27017});
  }

  // todo: add support to mongodb-download or prebuilt to return version
  getMemoryStorageName(): string {
    return "ephemeralForTest";

  }

  async getTempDBPath(): Promise<string> {
    let tempDir: string = path.resolve(os.tmpdir(), "mockmongoose", Date.now().toString());
    await fs.ensureDir(tempDir);
    return tempDir;
  }

  async killMongo(): Promise<void> {
    await (this.mongooseObj as Mongoose).connection.close();
    this.mongooseObj.mocked = false;
    this.mongodHelper.mongoBin.childProcess.kill('SIGKILL');
  }
}

export class ConnectionWrapper {

  originalArguments: any;
  functionName: string;
  functionCode: any;
  mongoose: any;
  connectionString: string;

  constructor(functionName: string, mongoose: any, connectionString: string) {
    this.functionName = functionName;
    this.mongoose = mongoose;
    this.functionCode = mongoose[functionName];
    this.connectionString = connectionString;
  }

  run(args: any): void {
    this.originalArguments = args;
    let mockedArgs: any = args;
    mockedArgs[0] = this.connectionString;
    return this.functionCode.apply(this.mongoose, mockedArgs);
  }

}



