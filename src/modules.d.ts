declare module '*.module.scss' {
    const resource: { [key: string]: string }
    export = resource;
}

declare module '*.svg' {
    const content: any
    export default content
}

declare module 'abi-decoder' {
    import { AbiItem } from 'web3-utils'

    declare function getABIs(): AbiItem[];
    declare function addABI(items: AbiItem[]): void;
    declare function removeABI(items: AbiItem[]): void;
    declare function getMethodIDs(): Map<string, AbiItem>;
    declare function keepNonDecodedLogs(): void;
    declare function discardNonDecodedLogs(): void

    export interface DecodedMethod {
        name: string;
        params: DecodedMethodParam[];
    }

    export interface DecodedMethodParam {
        name: string;
        type: string;
        value?: any;
    }

    declare function decodeMethod(data: string): DecodedMethod | undefined;

    export interface LogItem {
        address: string;
        data: string;
        topics: (string | string[])[];
        logIndex: number;
        transactionIndex: number;
        transactionHash: string;
        blockHash: string;
        blockNumber: number;
    }

    export interface DecodeLogs {
        address: string;
        events: any[];
        name: string;
    }

    declare function decodeLogs(logs: LogItem[]): DecodeLogs[];
}
