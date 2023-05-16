import fetch from "node-fetch";
let config;
export const setConfig = (adWebAuthConfig) => {
    config = adWebAuthConfig;
};
export const authenticate = async (userName, passwordPlain, adWebAuthConfig) => {
    try {
        const methodConfig = adWebAuthConfig || config;
        let authURL = methodConfig.url;
        if (!authURL.endsWith("/auth")) {
            authURL += "/auth";
        }
        let response;
        switch (methodConfig.method) {
            case "get":
                response = await fetch(authURL +
                    "/byGet?" +
                    methodConfig.userNameField +
                    "=" +
                    encodeURIComponent(userName) +
                    "&" +
                    methodConfig.passwordField +
                    "=" +
                    encodeURIComponent(passwordPlain), {
                    method: "get",
                });
                break;
            case "post":
                response = await fetch(authURL + "/byPost", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        [methodConfig.userNameField]: userName,
                        [methodConfig.passwordField]: passwordPlain,
                    }),
                });
                break;
            case "headers":
                response = await fetch(authURL + "/byHeaders", {
                    method: "get",
                    headers: {
                        [methodConfig.userNameField]: userName,
                        [methodConfig.passwordField]: passwordPlain,
                    },
                });
                break;
        }
        const success = (await response.json());
        return success;
    }
    catch (error) {
        console.log(error);
    }
};
