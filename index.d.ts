import type { ADWebAuthConfig } from './types';
export declare function setConfig(adWebAuthConfig: ADWebAuthConfig): void;
export declare function authenticate(userName: string, passwordPlain: string, adWebAuthConfig?: ADWebAuthConfig): Promise<boolean>;
