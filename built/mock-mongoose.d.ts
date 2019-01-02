import { MongodHelper } from 'mongodb-prebuilt';
import { MockMongooseHelper } from './mock-mongoose-helper';
export declare class MockMongoose {
    helper: MockMongooseHelper;
    mongodHelper: MongodHelper;
    debug: any;
    mongooseObj: any;
    constructor(mongooseObj: any);
    prepareStorage(): Promise<void>;
    getMockConnectionString(port: string): string;
    mockConnectCalls(connection: string): void;
    getOpenPort(): Promise<number>;
    getMemoryStorageName(): string;
    getTempDBPath(): Promise<string>;
    killMongo(): Promise<void>;
}
export declare class ConnectionWrapper {
    originalArguments: any;
    functionName: string;
    functionCode: any;
    mongoose: any;
    connectionString: string;
    constructor(functionName: string, mongoose: any, connectionString: string);
    run(args: any): void;
}
