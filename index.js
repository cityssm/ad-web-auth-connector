import fetch from "node-fetch";
let config;
export const setConfig = (adWebAuthConfig) => {
    config = adWebAuthConfig;
};
export const authenticate = async (userName, passwordPlain, adWebAuthConfig) => {
    const promise = new Promise((resolve, reject) => {
        const methodConfig = adWebAuthConfig || config;
        let authURL = methodConfig.url;
        if (!authURL.endsWith("/auth")) {
            authURL += "/auth";
        }
        let adFetch;
        switch (methodConfig.method) {
            case "get":
                adFetch = fetch(authURL + "/byGet?" +
                    methodConfig.userNameField + "=" + encodeURIComponent(userName) + "&" +
                    methodConfig.passwordField + "=" + encodeURIComponent(passwordPlain), {
                    method: "get"
                });
                break;
            case "post":
                adFetch = fetch(authURL + "/byPost", {
                    method: "post",
                    body: methodConfig.userNameField + "=" + encodeURIComponent(userName) + "&" +
                        methodConfig.passwordField + "=" + encodeURIComponent(passwordPlain)
                });
                break;
            case "headers":
                adFetch = fetch(authURL + "/byHeaders", {
                    method: "get",
                    headers: {
                        [methodConfig.userNameField]: userName,
                        [methodConfig.passwordField]: passwordPlain
                    }
                });
                break;
        }
        adFetch
            .then(async (response) => {
            return await response.json();
        })
            .then((auth) => {
            resolve(auth);
            return;
        })
            .catch((error) => {
            reject(error);
        });
    });
    return promise;
};
