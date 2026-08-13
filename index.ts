import type { ActiveDirectoryAuthenticateResult } from '@cityssm/activedirectory-authenticate'
import Debug from 'debug'

import type { ADWebAuthConfig } from './types.js'

const DEBUG_NAMESPACE = 'ad-web-auth-connector'

const debug = Debug(`${DEBUG_NAMESPACE}:index`)

export class AdWebAuthConnector {
  readonly #config: ADWebAuthConfig

  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  readonly #maxRetries = 3

  constructor(defaultConfig: ADWebAuthConfig) {
    this.#config = defaultConfig

    if (!this.#config.url.endsWith('/auth')) {
      this.#config.url += '/auth'
    }
  }

  /**
   * Authenticates a user with the provided username and password.
   * @param username - The user name to authenticate.
   * @param passwordPlain - The plaintext password of the user.
   * @returns A promise that resolves to a boolean indicating whether the authentication was successful.
   */
  async authenticate(
    username: string,
    passwordPlain: string
  ): Promise<boolean> {
    const result = await this.#authenticate(
      username,
      passwordPlain,
      this.#maxRetries,
      false
    )

    if (typeof result === 'boolean') {
      return result
    }

    return result.success
  }

  /**
   * Authenticates a user and returns the result with debug information.
   * ad-web-auth server must be version 0.2.0 or later.
   * @param username - The user name to authenticate.
   * @param passwordPlain - The plaintext password of the user.
   * @returns A promise that resolves to an object containing the authentication result and debug information.
   */
  async authenticateDebug(
    username: string,
    passwordPlain: string
  ): Promise<ActiveDirectoryAuthenticateResult> {
    const result = await this.#authenticate(
      username,
      passwordPlain,
      this.#maxRetries,
      true
    )

    if (typeof result === 'boolean') {
      if (result) {
        return {
          success: true,

          bindUserDN: '',
          sAMAccountName: username
        } satisfies ActiveDirectoryAuthenticateResult
      }

      return {
        success: false,

        bindUserDN: '',
        errorType: 'AUTHENTICATION_FAILED'
      } satisfies ActiveDirectoryAuthenticateResult
    }

    return result
  }

  async #authenticate(
    username: string,
    passwordPlain: string,
    remainingRetries: number,
    debugOutput: boolean
  ): Promise<ActiveDirectoryAuthenticateResult | boolean> {
    if (remainingRetries <= 0) {
      return false
    }

    try {
      let response: Response

      switch (this.#config.method) {
        case 'get': {
          response = await fetch(
            `${this.#config.url}/byGet?${
              this.#config.userNameField
            }=${encodeURIComponent(username)}&${
              this.#config.passwordField
            }=${encodeURIComponent(passwordPlain)}${debugOutput ? '&debug=true' : ''}`,
            {
              method: 'get'
            }
          )
          break
        }

        case 'headers': {
          response = await fetch(
            `${this.#config.url}/byHeaders${debugOutput ? '?debug=true' : ''}`,
            {
              method: 'get',

              headers: {
                [this.#config.passwordField]: passwordPlain,
                [this.#config.userNameField]: username,
              }
            }
          )

          break
        }

        case 'post': {
          response = await fetch(
            `${this.#config.url}/byPost${debugOutput ? '?debug=true' : ''}`,
            {
              method: 'post',

              headers: {
                'Content-Type': 'application/json'
              },

              body: JSON.stringify({
                [this.#config.passwordField]: passwordPlain,
                [this.#config.userNameField]: username,
              })
            }
          )

          break
        }
        // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
        default: {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          throw new Error(`Invalid method: ${this.#config.method}`)
        }
      }

      const result = (await response.json()) as
        ActiveDirectoryAuthenticateResult | boolean

      if (typeof result === 'boolean' && debugOutput) {
        if (result) {
          return {
            success: true,

            bindUserDN: '',
            sAMAccountName: username
          } satisfies ActiveDirectoryAuthenticateResult
        }

        return {
          success: false,

          bindUserDN: '',
          errorType: 'AUTHENTICATION_FAILED'
        } satisfies ActiveDirectoryAuthenticateResult
      }

      return result
    } catch (error) {
      debug(error)

      return await this.#authenticate(
        username,
        passwordPlain,
        remainingRetries - 1,
        debugOutput
      )
    }
  }
}

export type { ADWebAuthConfig } from './types.js'
