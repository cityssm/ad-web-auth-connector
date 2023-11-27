import assert from 'node:assert';
import * as adWebAuth from '../index.js';
import * as config from './config.js';
describe('ad-web-auth-connector', () => {
    before(() => {
        console.log(config.adWebAuthConfig);
        adWebAuth.setConfig(config.adWebAuthConfig);
    });
    it('Authenticates User 1 successfully', async () => {
        const success = await adWebAuth.authenticate(config.testUserSuccess.userName, config.testUserSuccess.password);
        assert.ok(success);
    });
    it('Authenticates User 2 successfully', async () => {
        const success = await adWebAuth.authenticate(config.testUser2Success.userName, config.testUser2Success.password);
        assert.ok(success);
    });
    for (let index = 1; index < 50; index += 1) {
        it(`Authenticates User 1 again successfully (${index.toString()})`, async () => {
            const success = await adWebAuth.authenticate(config.testUserSuccess.userName, config.testUserSuccess.password);
            assert.ok(success);
        });
    }
    it('Fails on invalid credentials', async () => {
        const success = await adWebAuth.authenticate(config.testUserSuccess.userName, `${config.testUserSuccess.password}x`);
        assert.ok(!success);
    });
});
