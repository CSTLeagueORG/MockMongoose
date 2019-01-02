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
   //TODO refactor this. It's too overengineered bullshit
  reset(): Promise<void>  {
    return new Promise<void>((resolve, reject) => {
      asyncEach(this.mongoose.connections, (connection: any, callback: Function) => {
        // check if it is mockmongoose connection
        if (!/mockmongoose-temp-db-/.test(connection.name)) {
          return callback();
        } 
        if ( connection.readyState !== 1 ) {
          return callback();
        }
        connection.dropDatabase((err: any) => {
          callback();
        }, (e: any) => {
          this.debug(`@reset err dropping database ${e}`);
          callback();
        });
      }, (err: any) => {
        if ( err ) {
          this.debug(`@reset err ${err}`);
          reject();
        } else {
          resolve();
        }
      })
    });
  };

  isMocked(): boolean {
    return this.mongoose.mocked;
  }
  
}