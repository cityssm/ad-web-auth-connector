export class AdWebAuthConnector {
    #config;
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    #maxRetries = 3;
    constructor(defaultConfig) {
        this.#config = defaultConfig;
        if (!this.#config.url.endsWith('/auth')) {
            this.#config.url += '/auth';
        }
    }
    async #authenticate(userName, passwordPlain, remainingRetries) {
        if (remainingRetries <= 0) {
            return false;
        }
        try {
            let response;
            switch (this.#config.method) {
                case 'get': {
                    response = await fetch(`${this.#config.url}/byGet?${this.#config.userNameField}=${encodeURIComponent(userName)}&${this.#config.passwordField}=${encodeURIComponent(passwordPlain)}`, {
                        method: 'get'
                    });
                    break;
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
                    });
                    break;
                }
                case 'headers': {
                    response = await fetch(`${this.#config.url}/byHeaders`, {
                        method: 'get',
                        headers: {
                            [this.#config.userNameField]: userName,
                            [this.#config.passwordField]: passwordPlain
                        }
                    });
                    break;
                }
                // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
                default: {
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    throw new Error(`Invalid method: ${this.#config.method}`);
                }
            }
            return (await response.json());
        }
        catch (error) {
            console.log(error);
            return await this.#authenticate(userName, passwordPlain, remainingRetries - 1);
        }
    }
    async authenticate(userName, passwordPlain) {
        return await this.#authenticate(userName, passwordPlain, this.#maxRetries);
    }
}
