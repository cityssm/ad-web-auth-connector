import fetch from 'node-fetch';
export class AdWebAuthConnector {
    #config;
    constructor(defaultConfig) {
        this.#config = defaultConfig;
        if (!this.#config.url.endsWith('/auth')) {
            this.#config.url += '/auth';
        }
    }
    async authenticate(userName, passwordPlain) {
        let success = false;
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
            }
            success = (await response.json());
        }
        catch (error) {
            console.log(error);
        }
        return success;
    }
}
