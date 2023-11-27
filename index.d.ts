import type { ADWebAuthConfig } from './types.js';
export declare class AdWebAuthConnector {
    #private;
    constructor(defaultConfig: ADWebAuthConfig);
    authenticate(userName: string, passwordPlain: string): Promise<boolean>;
}
