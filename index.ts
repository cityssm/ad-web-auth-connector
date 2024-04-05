import type { ADWebAuthConfig } from './types.js'

export class AdWebAuthConnector {
  readonly #config: ADWebAuthConfig

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
    remainingRetries: number
  ): Promise<boolean> {
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
            }=${encodeURIComponent(passwordPlain)}`,
            {
              method: 'get'
            }
          )
          break
        }

        case 'post': {
          response = await fetch(`${this.#config.url}/byPost`, {
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              [this.#config.userNameField]: userName,
              [this.#config.passwordField]: passwordPlain
            })
          })

          break
        }

        case 'headers': {
          response = await fetch(`${this.#config.url}/byHeaders`, {
            method: 'get',
            headers: {
              [this.#config.userNameField]: userName,
              [this.#config.passwordField]: passwordPlain
            }
          })

          break
        }
      }

      return (await response.json()) as boolean
    } catch (error) {
      console.log(error)
      return await this.#authenticate(
        userName,
        passwordPlain,
        remainingRetries - 1
      )
    }
  }

  async authenticate(
    userName: string,
    passwordPlain: string
  ): Promise<boolean> {
    return await this.#authenticate(userName, passwordPlain, this.#maxRetries)
  }
}

export type { ADWebAuthConfig } from './types.js'
