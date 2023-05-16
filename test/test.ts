import * as assert from "node:assert";

import * as config from "./config.js";

import * as adWebAuth from "../index.js";

describe("ad-web-auth-connector", () => {
  before(() => {
    adWebAuth.setConfig(config.adWebAuthConfig);
  });

  it("Authenticates User 1 successfully", async () => {
    const success = await adWebAuth.authenticate(
      config.testUserSuccess.userName,
      config.testUserSuccess.password
    );
    assert.ok(success);
  });

  it("Authenticates User 2 successfully", async () => {
    const success = await adWebAuth.authenticate(
      config.testUser2Success.userName,
      config.testUser2Success.password
    );
    assert.ok(success);
  });

  it("Authenticates User 1 again successfully", async () => {
    const success = await adWebAuth.authenticate(
      config.testUserSuccess.userName,
      config.testUserSuccess.password
    );
    assert.ok(success);
  });

  it("Fails on invalid credentials", async () => {
    const success = await adWebAuth.authenticate(
      config.testUserSuccess.userName,
      config.testUserSuccess.password + 'x'
    );
    assert.ok(!success);
  });
});
