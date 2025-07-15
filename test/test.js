import assert from 'node:assert';
import { describe, it } from 'node:test';
import { AdWebAuthConnector } from '../index.js';
import * as config from './config.js';
await describe('ad-web-auth-connector', async () => {
    const adWebAuth = new AdWebAuthConnector(config.adWebAuthConfig);
    await it('Fails on User 1 with invalid credentials', async () => {
        const success = await adWebAuth.authenticate(config.testUserSuccess.userName, `${config.testUserSuccess.password}x`);
        assert.ok(!success);
    });
    await it('Authenticates User 1 successfully', async () => {
        const success = await adWebAuth.authenticate(config.testUserSuccess.userName, config.testUserSuccess.password);
        assert.ok(success);
    });
    await it('Authenticates User 1 successfully again (with debug)', async () => {
        const result = await adWebAuth.authenticateDebug(config.testUserSuccess.userName, config.testUserSuccess.password);
        // eslint-disable-next-line no-console
        console.log(result);
        assert.ok(result.success);
    });
    await it('Authenticates User 2 successfully', async () => {
        const success = await adWebAuth.authenticate(config.testUser2Success.userName, config.testUser2Success.password);
        assert.ok(success);
    });
});
