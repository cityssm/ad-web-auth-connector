"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.setConfig = void 0;
const node_fetch_1 = require("node-fetch");
let config = null;
const setConfig = (adWebAuthConfig) => {
    config = adWebAuthConfig;
};
exports.setConfig = setConfig;
const authenticate = (userName, passwordPlain, adWebAuthConfig) => __awaiter(void 0, void 0, void 0, function* () {
    const promise = new Promise((resolve, reject) => {
        const methodConfig = adWebAuthConfig || config;
        let authURL = methodConfig.url;
        if (!authURL.endsWith("/auth")) {
            authURL += "/auth";
        }
        let adFetch;
        switch (methodConfig.method) {
            case "get":
                adFetch = node_fetch_1.default(authURL + "/byGet?" +
                    methodConfig.userNameField + "=" + encodeURIComponent(userName) + "&" +
                    methodConfig.passwordField + "=" + encodeURIComponent(passwordPlain), {
                    method: "get"
                });
                break;
            case "post":
                adFetch = node_fetch_1.default(authURL + "/byPost", {
                    method: "post",
                    body: methodConfig.userNameField + "=" + encodeURIComponent(userName) + "&" +
                        methodConfig.passwordField + "=" + encodeURIComponent(passwordPlain)
                });
                break;
            case "headers":
                adFetch = node_fetch_1.default(authURL + "/byHeaders", {
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
            .then((auth) => {
            resolve(auth);
        })
            .catch((err) => {
            reject(err);
        });
    });
    return promise;
});
exports.authenticate = authenticate;
