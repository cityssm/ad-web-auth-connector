import type { ActiveDirectoryAuthenticateResult } from '@cityssm/activedirectory-authenticate'

import type { ADWebAuthConfig } from './types.js'

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

  async #authenticate(
    userName: string,
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
            }=${encodeURIComponent(userName)}&${
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
                [this.#config.userNameField]: userName,
                [this.#config.passwordField]: passwordPlain
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
                [this.#config.userNameField]: userName,
                [this.#config.passwordField]: passwordPlain
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

      return (await response.json()) as
        | ActiveDirectoryAuthenticateResult
        | boolean
    } catch (error) {
      console.log(error)

      return await this.#authenticate(
        userName,
        passwordPlain,
        remainingRetries - 1,
        debugOutput
      )
    }
  }

  /**
   * Authenticates a user with the provided username and password.
   * @param userName - The username to authenticate.
   * @param passwordPlain - The plaintext password of the user.
   * @returns A promise that resolves to a boolean indicating whether the authentication was successful.
   */
  async authenticate(
    userName: string,
    passwordPlain: string
  ): Promise<boolean> {
    return (await this.#authenticate(
      userName,
      passwordPlain,
      this.#maxRetries,
      false
    )) as boolean
  }

  /**
   * Authenticates a user and returns the result with debug information.
   * ad-web-auth server must be version 0.2.0 or later.
   * @param userName - The username to authenticate.
   * @param passwordPlain - The plaintext password of the user.
   * @returns A promise that resolves to an object containing the authentication result and debug information.
   */
  async authenticateDebug(
    userName: string,
    passwordPlain: string
  ): Promise<ActiveDirectoryAuthenticateResult> {
    return (await this.#authenticate(
      userName,
      passwordPlain,
      this.#maxRetries,
      true
    )) as ActiveDirectoryAuthenticateResult
  }
}

export type { ADWebAuthConfig } from './types.js'
