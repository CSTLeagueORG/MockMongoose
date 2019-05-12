import {Connection, Mongoose} from "mongoose";

const Debug: any = require('debug');
import {each as asyncEach} from 'async';
let httpsProxyAgent = require('https-proxy-agent');

export class MockMongooseHelper {
  debug: any;

  constructor(public mongoose: any, public mockmongoose: any) {
    this.debug = Debug('MockMongooseHelper');
  }

  setDbVersion(version: string) {{
    this.mockmongoose.mongodHelper.mongoBin.mongoDBPrebuilt.mongoDBDownload.options.version = version;
  }}

  setProxy(proxy: string) {
    this.mockmongoose.mongodHelper.mongoBin.mongoDBPrebuilt.mongoDBDownload.options.http = {
      agent: new httpsProxyAgent(proxy)
    };
  }
  async reset(): Promise<void>  {
    for (let connection of this.mongoose.connections) {
      if (!/mockmongoose-temp-db-/.test(connection.name)) {
        continue;
      }
      if ( connection.readyState !== 1 ) {
        continue;
      }
      try {
        await connection.dropDatabase();
      } catch (e) {
        this.debug(`@reset err dropping database ${e}`);
      }
    }
  };

  isMocked(): boolean {
    return this.mongoose.mocked;
  }
  
}
