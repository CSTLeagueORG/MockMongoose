export declare class MockMongooseHelper {
    mongoose: any;
    mockmongoose: any;
    debug: any;
    constructor(mongoose: any, mockmongoose: any);
    setDbVersion(version: string): void;
    setProxy(proxy: string): void;
    reset(): Promise<void>;
    isMocked(): boolean;
}
