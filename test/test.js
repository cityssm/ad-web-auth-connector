import assert from 'node:assert';
import { describe, it } from 'node:test';
import { AdWebAuthConnector } from '../index.js';
import * as config from './config.js';
await describe('ad-web-auth-connector', async () => {
    const adWebAuth = new AdWebAuthConnector(config.adWebAuthConfig);
    await it('Fails on User 1 with invalid credentials', async () => {
        const success = await adWebAuth.authenticate(config.testUserSuccess.username, `${config.testUserSuccess.password}x`);
        assert.strictEqual(success, false);
    });
    await it('Authenticates User 1 successfully', async () => {
        const success = await adWebAuth.authenticate(config.testUserSuccess.username, config.testUserSuccess.password);
        assert.strictEqual(success, true);
    });
    await it('Authenticates User 1 successfully again (with debug)', async () => {
        const result = await adWebAuth.authenticateDebug(config.testUserSuccess.username, config.testUserSuccess.password);
        // eslint-disable-next-line no-console
        console.log(result);
        assert.strictEqual(result.success, true);
    });
    await it('Authenticates User 2 successfully', async () => {
        const success = await adWebAuth.authenticate(config.testUser2Success.username, config.testUser2Success.password);
        assert.strictEqual(success, true);
    });
});
