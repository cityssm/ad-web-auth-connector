import type { ADWebAuthConfig } from "./types";
export declare const setConfig: (adWebAuthConfig: ADWebAuthConfig) => void;
export declare const authenticate: (userName: string, passwordPlain: string, adWebAuthConfig?: ADWebAuthConfig) => Promise<boolean>;
