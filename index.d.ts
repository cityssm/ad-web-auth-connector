import type { ActiveDirectoryAuthenticateResult } from '@cityssm/activedirectory-authenticate';
import type { ADWebAuthConfig } from './types.js';
export declare class AdWebAuthConnector {
    #private;
    constructor(defaultConfig: ADWebAuthConfig);
    /**
     * Authenticates a user with the provided username and password.
     * @param userName - The username to authenticate.
     * @param passwordPlain - The plaintext password of the user.
     * @returns A promise that resolves to a boolean indicating whether the authentication was successful.
     */
    authenticate(userName: string, passwordPlain: string): Promise<boolean>;
    /**
     * Authenticates a user and returns the result with debug information.
     * ad-web-auth server must be version 0.2.0 or later.
     * @param userName - The username to authenticate.
     * @param passwordPlain - The plaintext password of the user.
     * @returns A promise that resolves to an object containing the authentication result and debug information.
     */
    authenticateDebug(userName: string, passwordPlain: string): Promise<ActiveDirectoryAuthenticateResult>;
}
export type { ADWebAuthConfig } from './types.js';
