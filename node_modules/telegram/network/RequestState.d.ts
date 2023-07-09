/// <reference types="node" />
import bigInt from "big-integer";
export declare class RequestState {
    containerId?: bigInt.BigInteger;
    msgId?: bigInt.BigInteger;
    request: any;
    data: Buffer;
    after: any;
    result: undefined;
    promise: Promise<unknown>;
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
    constructor(request: any, after?: undefined);
}
