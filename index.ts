import fetch, { Response } from "node-fetch";

import type { ADWebAuthConfig } from "./types";


let config: ADWebAuthConfig = null;


export const setConfig = (adWebAuthConfig: ADWebAuthConfig) => {
  config = adWebAuthConfig;
};


export const authenticate = async (userName: string, passwordPlain: string, adWebAuthConfig?: ADWebAuthConfig): Promise<boolean> => {

  const promise = new Promise((resolve: (auth: boolean) => void, reject) => {

    const methodConfig = adWebAuthConfig || config;

    let authURL = methodConfig.url;

    if (!authURL.endsWith("/auth")) {
      authURL += "/auth";
    }

    let adFetch: Promise<Response>;

    switch (methodConfig.method) {

      case "get":
        adFetch = fetch(
          authURL + "/byGet?" +
          methodConfig.userNameField + "=" + encodeURIComponent(userName) + "&" +
          methodConfig.passwordField + "=" + encodeURIComponent(passwordPlain), {
            method: "get"
          });
        break;

      case "post":
        adFetch = fetch(
          authURL + "/byPost", {
            method: "post",
            body: methodConfig.userNameField + "=" + encodeURIComponent(userName) + "&" +
              methodConfig.passwordField + "=" + encodeURIComponent(passwordPlain)
          });
        break;

      case "headers":
        adFetch = fetch(
          authURL + "/byHeaders", {
            method: "get",
            headers: {
              [methodConfig.userNameField]: userName,
              [methodConfig.passwordField]: passwordPlain
            }
          });
        break;
    }

    adFetch
      .then((res) => {
        return res.json();
      })
      .then((auth: boolean) => {
        resolve(auth);
      })
      .catch((err) => {
        reject(err);
      });
  });

  return promise;
};
